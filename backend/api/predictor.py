import joblib
import pandas as pd
import shap
import lime.lime_tabular
import matplotlib.pyplot as plt
from sklearn import tree
from django.conf import settings
import warnings
from loguru import logger
from sklearn.exceptions import InconsistentVersionWarning
import matplotlib
matplotlib.use("Agg")
# warnings.filterwarnings("ignore", category=InconsistentVersionWarning) #Related to loading pickle models
warnings.filterwarnings("ignore")

logger.info("Importing models using model paths📳 ")
MODEL_PATHS = settings.BASE_DIR / "model_paths"
MODEL_IMAGES = settings.MEDIA_ROOT
DATASET_PATH = settings.BASE_DIR / "data" / "cancer_patient.csv"
# Load models at startup
model_paths = {
    "logistic": MODEL_PATHS / "LogisticRegression().joblib",
    "gaussian": MODEL_PATHS / "GaussianNB().joblib",
    "decision_tree": MODEL_PATHS / "DecisionTreeClassifier().joblib",
    # "random_forest": MODEL_PATHS / "RandomForestClassifier().joblib"
}
models = {name: joblib.load(path) for name, path in model_paths.items()}
logger.success("Models loaded successfully✅ ")
# Load dataset for future processing
logger.info("Importing the train dataset 99 points📅")
df = pd.read_csv(DATASET_PATH, nrows=99)
df=df.drop(labels=["index","Patient Id"],axis=1)
logger.success(f"Dataset loaded successfully✅ Shape : {df.shape}")
levels={
    "High":0,
    "Medium":1,
    "Low":2
}

def predict(model, df_test):
    pred = model.predict(df_test)[0]
    if hasattr(model, "predict_proba"):
        prob = model.predict_proba(df_test)[0][1]
    else:
        prob = None
    return pred, prob


def get_local_shap_image(model, X100, model_name):
    # Get feature names without the target column
    feature_names = df.drop(columns=["Level"]).columns.to_list()
    explainer = shap.Explainer(model.predict, X100, feature_names=list(model.feature_names_in_), output_names=list(levels.keys()))
    shap_values = explainer(X100) 
    image_path = MODEL_IMAGES / f"{model_name}_shap_local.png"
    shap.plots.waterfall(shap_values[-1], show=False)
    plt.savefig(image_path, bbox_inches='tight')
    plt.close()
    logger.success(f"got local shap image for {model_name}")
    return f"{model_name}_shap_local.png"


def get_local_lime_image(model, X100, model_name):
    # Get feature names without the target column
    feature_names = df.drop(columns=["Level"]).columns.tolist()
    explainer = lime.lime_tabular.LimeTabularExplainer(
        training_data=X100,
        mode="classification",
        feature_names=list(model.feature_names_in_),
        class_names=list(levels.keys()), 
        verbose=False
    )
    exp = explainer.explain_instance(X100[-1], model.predict_proba)
    image_path = MODEL_IMAGES / f"{model_name}_lime_local.png"
    fig = exp.as_pyplot_figure()
    fig.savefig(image_path,bbox_inches='tight')
    plt.close(fig)
    logger.success(f"got local lime image for {model_name}")
    return f"{model_name}_lime_local.png"


def run_all_predictions(factors_dict, request):
    df_test = pd.DataFrame([factors_dict])
    results = {}
    
    # Separate features from target in the training data
    # X_train = df.drop(columns=["Level"])
    # y_train = df["Level"].map(levels)
    # Concatenate training features with test features (excluding target)
    
    X100_numpy  = pd.concat([df.drop(labels=["Level"],axis=1), df_test], ignore_index=True)
    # X100_numpy = X100.to_numpy()
    # print(f" X100 dtype: {X100_numpy.dtype} shape: {X100_numpy.shape}")
    
    for name, model in models.items():
        pred, prob = predict(model, df_test)

        shap_filename = get_local_shap_image(model, X100_numpy, name)
        lime_filename = get_local_lime_image(model, X100_numpy.to_numpy(), name)
        # logger.debug(slice(None, None, None), 0)

        result = {
            "prediction": str(pred),
            "probability": round(prob, 2) if prob is not None else None,
            # "shap_image": request.build_absolute_uri(settings.MEDIA_URL + shap_filename),
            "lime_image": request.build_absolute_uri(settings.MEDIA_URL + lime_filename)
        }

        results[name] = result

    # Global images
    results["global_explainability"] = {
        "shap_summary_image": request.build_absolute_uri(settings.MEDIA_URL + "shap_global.png"),
        "lime_summary_image": request.build_absolute_uri(settings.MEDIA_URL + "lime_global.png")
    }

    return results
