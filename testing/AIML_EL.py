# %%
"""
# Exploring Lung Cancer
"""

# %%
"""
**🫁 Lung Cancer Risk Prediction Based on Environmental Factors**


---


📘 Overview

Lung cancer remains the leading cause of cancer-related deaths globally, claiming over **1.80 million lives** in 2020 alone. While smoking is a well-established cause, non-smokers are not exempt. Increasing evidence suggests that air pollution—especially prolonged exposure to fine particulate matter (PM2.5)—may significantly elevate the risk of lung cancer, even in individuals who have never smoked.
"""

# %%
"""
**🧠 Objective**

---



The *aim* of this notebook is to:
Model lung cancer risk using *supervised machine learning* techniques
Apply* explainable AI (XAI) *tools (like SHAP or LIME) to understand what features most influence model predictions
"""

# %%
"""
## Dependencies and Data Loading
"""

# %%
# ! pip install numpy pandas matplotlib seaborn scikit-learn shap lime --quiet
# ! pip install xgboost lightgbm catboost --quiet
# ! pip install rich --quiet

# %%
import numpy as np
import pandas as pd
import matplotlib
import matplotlib.pyplot as plt
import seaborn as sns
import sklearn
import warnings
warnings.filterwarnings('ignore')
np.set_printoptions(suppress=True, precision=4) # does not use letter e for printing

print(f"NumPy version       : {np.__version__}")
print(f"Pandas version      : {pd.__version__}")
print(f"Matplotlib version  : {matplotlib.__version__}")
print(f"Seaborn version     : {sns.__version__}")
print(f"Scikit-learn version: {sklearn.__version__}")


# %%
df=pd.read_csv("./cancer patient data sets.csv")
df=df.drop(labels=["index","Patient Id"],axis=1)
df.head(5)

# %%
from rich import print


# %%
print("Shape:",df.shape)
print("Columns:",df.columns)
print("Total Null values in dataset:",df.isnull().sum().sum())

# %%
"""
Observation :
* Contribution of ['Alcohol use', 'Fatigue', 'Passive Smoker', 'Genetic Risk', 'Obesity','OccuPational Hazards', 'Dust Allergy', 'Age'] is high
"""

# %%
type(df["Fatigue"].value_counts())

# %%
"""

"""

# %%
"""
## Train-Test Split and Feature Description
"""

# %%
features_description = {
    
    "Age": "Numeric - Age of the patient",
    "Gender": "Categorical - Gender of the patient",
    "Air Pollution": "Categorical - Level of air pollution exposure",
    "Alcohol use": "Categorical - Level of alcohol use",
    "Dust Allergy": "Categorical - Level of dust allergy",
    "OccuPational Hazards": "Categorical - Level of occupational hazards",
    "Genetic Risk": "Categorical - Level of genetic risk",
    "chronic Lung Disease": "Categorical - Level of chronic lung disease",
    "Balanced Diet": "Categorical - Level of balanced diet",
    "Obesity": "Categorical - Level of obesity",
    "Smoking": "Categorical - Level of smoking",
    "Passive Smoker": "Categorical - Level of passive smoking exposure",
    "Chest Pain": "Categorical - Level of chest pain",
    "Coughing of Blood": "Categorical - Level of coughing of blood",
    "Fatigue": "Categorical - Level of fatigue",
    "Weight Loss": "Categorical - Level of weight loss",
    "Shortness of Breath": "Categorical - Level of shortness of breath",
    "Wheezing": "Categorical - Level of wheezing",
    "Swallowing Difficulty": "Categorical - Level of swallowing difficulty",
    "Clubbing of Finger Nails": "Categorical - Level of clubbing of finger nails",
    'Frequent Cold':"Categorical - Frequency of COld",
    'Dry Cough':"Categorical -Level of Cough",
    'Snoring':"Categorical - Level of Snoring",
    'Level':"Categorical - Low,Medium,High "
}

# %%
# import math
# features = df.columns
# n_cols = 3
# n_rows = math.ceil(len(features) / n_cols)
# plt.figure(figsize=(18, 5 * n_rows))

# for i, column in enumerate(features):
#     plt.subplot(n_rows, n_cols, i + 1)
#     sns.histplot(data=df, x=column, kde=True, hue="Level")
#     plt.title(f"{column}: {features_description[column]}")
#     plt.tight_layout()

# plt.show()

# %%
X,y=df.iloc[:,:-1],df.iloc[:,-1]
X_train,X_test,y_train,y_test=sklearn.model_selection.train_test_split(X,y,test_size=0.2,random_state=1)

# %%
"""
## Filter Methods
🔍 Filter Methods:
- Select features independently of any machine learning model.
- Based on statistical scores like correlation, chi-square, mutual information.
- ❌ Doesn’t consider how features interact with a specific model
- Reference: https://www.ibm.com/think/topics/feature-selection
"""

# %%
"""
### 1.Variance
"""

# %%
variances = df.var()
scaler = sklearn.preprocessing.StandardScaler()
normalized_variance = scaler.fit_transform(variances.values.reshape(-1, 1)).flatten()
plt.figure(figsize=(3,3))
plt.bar(list(range(len(df.columns))), normalized_variance, color='skyblue')
plt.title("Normalized Feature Variances")
plt.ylabel("Standardized Variance (Z-score)")
plt.tight_layout()
plt.show()

# %%
"""
Observation:Cannot exclude any column since all have low variances
"""

# %%
"""
### 2. K Best Features (using Information Gain)
"""

# %%
gbc = sklearn.ensemble.GradientBoostingClassifier(max_depth=5, random_state=42)
f1_score_list = []
# for k in range(1,df.shape[1]-1):
#     selector = sklearn.feature_selection.SelectKBest(sklearn.feature_selection.mutual_info_classif, k=k)
#     selector.fit(X_train, y_train)
#     sel_X_train = selector.transform(X_train)
#     sel_X_test = selector.transform(X_test)
#     gbc.fit(sel_X_train, y_train)
#     y_pred = gbc.predict(sel_X_test)
#     f1_score_kbest = round(sklearn.metrics.f1_score(y_test, y_pred, average='weighted'), 3)
#     f1_score_list.append(f1_score_kbest)

# %%
plt.figure(figsize=(6, 3))
sns.barplot(x=np.arange(1, len(f1_score_list)+1), y=f1_score_list)
plt.xlabel("Number of Features")
plt.ylabel("F1 Score")
plt.ylim(0, 1.2)
plt.tight_layout()
plt.show()

# %%
"""
### 📘 Mutual Information using Entropy
"""

# %%
"""

Mutual Information between two random variables X and Y is defined as:

$$
I(X; Y) = H(X) - H(X \mid Y)
$$

Or equivalently:

$$
I(X; Y) = H(Y) - H(Y \mid X)
$$

Or in terms of joint entropy:

$$
I(X; Y) = H(X) + H(Y) - H(X, Y)
$$

Where H(W) is entropy of W

- If X and Y are independent, then \( I(X; Y) = 0 \).

"""

# %%
"""
Observation:
* Using LR couldn't converge to best soln. even using 500 epochs
* Using gbc getting good f1-score using 4 features
"""

# %%
selector = sklearn.feature_selection.SelectKBest(
    sklearn.feature_selection.mutual_info_classif, k=3)
selector.fit(X_train, y_train)
selected_feature_mask = selector.get_support()
selected_feature_mask # returns boolean array

# %%
top_3_columns=[]
for index,column in enumerate(df.columns[:-1]):
  if(selected_feature_mask[index]):
    top_3_columns.append(column)
top_3_columns

# %%
"""

"""

# %%
"""
### 3. Chi Square Test (used for Categorical Data)

"""

# %%
"""
- Compute chi-squared stats between each non-negative feature and class.
- must contain only non-negative integer feature values such as booleans or frequencies (e.g., term counts in document classification), relative to the classes.
- If some of your features are continuous, you need to bin them, for example by using KBinsDiscretizer.
"""

# %%
chi2_stats, p_values = sklearn.feature_selection.chi2(X_train, y_train)
# Make sure your color list matches or exceeds the number of features
color_list = ['#1b9e77', '#a9f971', '#fdaa48', '#6890F0', '#A890F0']
plt.style.use('Solarize_Light2')  # Correct usage
# Plotting chi-square values against feature names
plt.figure(figsize=(8, 6))
plt.barh(y=df.columns[:-1], width=chi2_stats, color=color_list[:len(df.columns[:-1])])
plt.title("Chi-square Feature Importance", color="purple")
plt.xlabel("Chi-square statistic")
plt.ylabel("Features")
plt.tight_layout()
plt.show()


# %%
"""
Observation:
- Coughing of Blood ,Alcohol Use,Passive smoker,Obesity,Smoking is decreasing order of chi square values
"""

# %%
"""
## Wrapper Methods
"""

# %%
"""
🧪 Wrapper Methods:
- Use the model itself to evaluate feature subsets.
- Try different combinations → train → test → pick the best set.
- ❌ Slower, computationally expensive
"""

# %%
"""
# Model Training
"""

# %%
"""
## Model Imports
"""

# %%
from sklearn.tree import DecisionTreeClassifier,plot_tree
from sklearn.naive_bayes import GaussianNB
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score,classification_report,confusion_matrix
from sklearn.ensemble import RandomForestClassifier

# %%
observed_columns=[3,11,13,9,10]
print(df.columns[observed_columns])

# %%
"""
## Desicion Tree Classifier
"""

# %%
dt = DecisionTreeClassifier(random_state=42)
dt.fit(X_train,y_train)
y_pred_dt=dt.predict(X_test)
print(classification_report(y_test,y_pred_dt))
_=plot_tree(dt,filled=True)

# %%
"""
Observation:
- DT is using only columns Passive Smoker,Wheezing,Obesity,Coughing of Blood,Snoring and giving 100% accuracy
"""

# %%
"""
## Gaussian Naive Bayes
"""

# %%
# 8. Naive Bayes
nb = GaussianNB()
nb.fit(X_train, y_train)
y_pred_nb = nb.predict(X_test)
print(classification_report(y_test,y_pred_nb))

# %%
"""
## Logistic Regression
"""

# %%
#inorder to make shap visualization easier,,,
#shap doesnt take categorical values as input
levels={
    "High":0,
    "Medium":1,
    "Low":2
}
y_train=y_train.apply(lambda x:levels[x])
y_test=y_test.apply(lambda x:levels[x])

# %%
lr=LogisticRegression(max_iter=100)
lr.fit(X_train,y_train)
y_pred_lr=lr.predict(X_test)
lr_accuracy_score=accuracy_score(y_test,y_pred_lr)
print(classification_report(y_test,y_pred_lr))
print(confusion_matrix(y_test,y_pred_lr))

# %%
"""
## Logisitc Regression with observed columns
"""

# %%
X_train_obs=X_train.iloc[:,observed_columns]
X_test_obs=X_test.iloc[:,observed_columns]
lr_obs=LogisticRegression(max_iter=100)
lr_obs.fit(X_train_obs,y_train)
y_pred_lr_obs=lr_obs.predict(X_test_obs)
lr_accuracy_score=accuracy_score(y_test,y_pred_lr_obs)
print(classification_report(y_test,y_pred_lr_obs))
print(confusion_matrix(y_test,y_pred_lr_obs))

# %%
"""
## Random Forest
"""

# %%
rf=RandomForestClassifier()
rf.fit(X_train,y_train)
y_pred=rf.predict(X_test)
print(classification_report(y_test,y_pred))

# %%
"""
# Model Explanation

"""

# %%
"""
## SHAP
**Shapely Additive Values**
"""

# %%
"""
- Reference : 
* https://youtu.be/dZANiP_cOB0?si=JcJi6pzpgCQO_swE (best to understand)
* https://youtu.be/NBg7YirBTN8?si=0O0ZNXsFKRKvKG92 #very nice
* https://youtube.com/playlist?list=PLqDyyww9y-1SJgMw92x90qPYpHgahDLIK&si=JtEsMGb6BGdccR3w
"""

# %%
import shap
shap.initjs()
X100=X_test.iloc[:100,:].to_numpy()
print(X100.dtype)

# %%
print(X_test.iloc[1].shape)
print(X_test.iloc[1])	# Returns a Series → shape (n_features,)
print(X_test.iloc[[1]].shape)
X_test.iloc[[1]]	# Returns a DataFrame → shape (1, n_features)


# %%
print(lr.predict(X_test.iloc[[1]]))
print(lr.predict_proba(X_test.iloc[[1]]))

# %%

explainer = shap.Explainer(lr.predict, X100, feature_names = X_train.columns.to_list(), output_names = list(levels.keys()) )
shap_values = explainer(X100) #better to give smaller dataset,but X is already small-1000
print("Shape of shap_values",shap_values.shape) #23 shap values for each row

# %%
lr.predict(X100[[1]])

# %%
shap.plots.waterfall(shap_values[1])  # For one sample  how each feature nudged the prediction

# %%
shap.plots.beeswarm(shap_values) # For all samples — global importance summary

# %%
shap.summary_plot(shap_values,X,plot_type="bar")

# %%
df.columns[[3,14,11,6,9,5,4,0]]

# %%
"""
## LIME 
**Local Interpretable Model-agnostic Explanations**
"""

# %%
from lime.lime_tabular import LimeTabularExplainer
lime_explainer = LimeTabularExplainer(
    X_train.values, feature_names =  list(X_train.columns),  
    class_names = list(levels.keys()), 
    verbose=True,mode = 'classification')

# %%
rf.predict_proba(X_test.iloc[[1]])

# %%
instance_explanation=lime_explainer.explain_instance(X_test.iloc[1].values,rf.predict_proba)
instance_explanation.as_pyplot_figure()
instance_explanation.save_to_file('lime_explanation.html')



# %%
print(instance_explanation.as_list())


# %%
rf.classes_

# %%
# ! pip install ipynb-py-convert

# %%
# ! ipynb-py-convert AIML_EL.ipynb AIML_EL.py

# %%
len(rf.estimators_)

# %%
from sklearn.tree import plot_tree
plt.figure(figsize=(20, 10))
plot_tree(rf.estimators_[0], feature_names=X_train.columns, filled=True)
plt.show()

# %%
str(rf)

# %%
# Saving all models
from joblib import dump
import os
def save_model(model):
    os.makedirs("ml_models",exist_ok=True)
    dump(model,os.path.join("models",str(model)+".joblib"))  
# save_model(nb)
