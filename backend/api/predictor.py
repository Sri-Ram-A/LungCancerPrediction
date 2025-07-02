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
    
    # Create explainer
    explainer = shap.Explainer(model.predict, X100, 
                             feature_names=list(model.feature_names_in_), 
                             output_names=list(levels.keys()))
    
    # Calculate SHAP values
    shap_values = explainer(X100)
    
    # Create directory if it doesn't exist
    MODEL_IMAGES.mkdir(parents=True, exist_ok=True)
    
    # Generate and save waterfall plot (local explanation)
    local_path = MODEL_IMAGES / f"{model_name}_shap_local.png"
    plt.figure()
    shap.plots.waterfall(shap_values[-1], show=False)
    plt.savefig(local_path, bbox_inches='tight')
    plt.close()
    
    # Generate and save summary plot (global explanation)
    global_path = MODEL_IMAGES / f"{model_name}_shap_global.png"
    plt.figure()
    shap.summary_plot(shap_values, X100, plot_type="bar", show=False)
    plt.savefig(global_path, bbox_inches='tight')
    plt.close()
    
    logger.success(f"Successfully generated SHAP images for {model_name}")
    return f"{model_name}_shap_local.png", f"{model_name}_shap_global.png"
        


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
    X100_numpy = pd.concat([df.drop(labels=["Level"],axis=1), df_test], ignore_index=True)
    
    for name, model in models.items():
        try:
            pred, prob = predict(model, df_test)
            shap_filename, shap_global_filename = get_local_shap_image(model, X100_numpy, name)
            lime_filename = get_local_lime_image(model, X100_numpy.to_numpy(), name)
            
            # Ensure all fields are present even if None
            result = {
                "prediction": str(pred),
                "probability": round(float(prob), 2) if prob is not None else 0.0,
                "shap_image": request.build_absolute_uri(settings.MEDIA_URL + shap_filename) if shap_filename else None,
                "lime_image": request.build_absolute_uri(settings.MEDIA_URL + lime_filename) if lime_filename else None,
                "shap_summary_image": request.build_absolute_uri(settings.MEDIA_URL + shap_global_filename) if shap_global_filename else None
            }
            results[name] = result
        except Exception as e:
            logger.error(f"Error processing model {name}: {str(e)}")
            results[name] = {
                "prediction": "0",
                "probability": 0.0,
                "shap_image": None,
                "lime_image": None,
                "shap_summary_image": None
            }

    return results
