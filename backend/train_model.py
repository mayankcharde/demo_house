# import pandas as pd
# import numpy as np
# from sklearn.model_selection import train_test_split
# from sklearn.linear_model import LinearRegression
# import joblib
# from pymongo import MongoClient

# # Load dataset from CSV
# df = pd.read_csv("data/housing_data.csv")

# # Drop missing values (if any)
# df = df.dropna()

# # Define features (X) and target (y)
# X = df.drop(columns=["price"])  # Ensure "price" is the target column
# y = df["price"]

# # Split dataset
# X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# # Train model
# model = LinearRegression()
# model.fit(X_train, y_train)

# # Save model
# joblib.dump(model, "models/house_price_model.pkl")

# # Connect to MongoDB and insert data
# client = MongoClient("mongodb+srv://mayankcharde2:price@priceprediction.yzzp6.mongodb.net/")
# db = client["housing_db"]
# collection = db["housing_data"]

# # Clear old data and insert new dataset
# collection.delete_many({})
# collection.insert_many(df.to_dict(orient="records"))

# print("Model trained and dataset stored in MongoDB!")




import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
import joblib

# Load dataset
df = pd.read_csv("data/housing_data.csv")

# Drop missing values
df = df.dropna()

# Define features (X) and target (y)
X = df.drop(columns=["price"])  # All columns except "price"
y = df["price"]

# Split dataset into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train a Linear Regression model
model = LinearRegression()
model.fit(X_train, y_train)

# Save the trained model
joblib.dump(model, "models/house_price_model.pkl")

print("✅ Model trained and saved as 'models/house_price_model.pkl'")
