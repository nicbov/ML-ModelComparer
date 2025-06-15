#ML Model Comparer: Heart Disease Prediction

This project compares multiple machine learning models on the Heart Disease dataset to evaluate their performance side-by-side. The goal is to understand how different algorithms behave on the same data and help select the most effective one for deployment or analysis.

##Features

- Trains and evaluates:
  - Logistic Regression
  - Random Forest
  - Support Vector Machine (SVM)
  - XGBoost (Extreme Gradient Boosting)
- Prints classification accuracy and performance metrics (precision, recall, F1 score)
- Modular model structure for easy extension

- ## Installation

1. Clone the repo:

bash:
"git clone https://github.com/nicbov/ML-ModelComparer.git"
"cd ML-ModelComparer"

Create a Virtual Environment:
"python3 -m venv venv"        
"source venv/bin/activate" # macOS/Linux

# or on Windows
"venv\Scripts\activate"

Install requirements:
"pip install -r requirements.txt"

You will run into a bug on MacOS with XGBoost, the fix will be downloading this(you need homebrew or lookup a different way to install libomp)
"brew install libomp"

Once all of that is finished, to run the app, just run:
"python app.py"


MIT license
