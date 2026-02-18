# Credit Card Fraud Detection

A full-stack machine learning application that detects fraudulent credit card transactions using an XGBoost model trained on 284K+ transactions. Upload a CSV of transactions and get instant fraud predictions with probability scores.

## Tech Stack

| Layer | Technology |
|---|---|
| ML Model | XGBoost (Optuna-tuned, 0.6 threshold) |
| Backend | FastAPI, SQLAlchemy (async), Supabase PostgreSQL |
| Frontend | React 19, TypeScript, Tailwind CSS v4, Vite |
| Auth | JWT with httpOnly cookies, bcrypt |
| Charts | Recharts |
| Icons | Lucide React |

## Project Structure

```
├── backend/
│   └── app/
│       ├── main.py              # FastAPI app + CORS
│       ├── auth.py              # JWT creation/validation, password hashing
│       ├── config.py            # Feature columns, model path, CORS origins
│       ├── database.py          # Async SQLAlchemy + Supabase PostgreSQL
│       ├── models.py            # User ORM model (UUID PK)
│       ├── crud.py              # User CRUD operations
│       ├── dependencies.py      # Cookie-based auth dependency
│       ├── routes/
│       │   ├── predict.py       # POST /predict/batch, GET /sample
│       │   └── users.py         # Register, login, logout, profile, username check
│       ├── schemas/
│       │   ├── transaction.py   # PredictionResult, BatchResponse
│       │   └── user.py          # UserCreate, UserLogin, UserResponse
│       └── services/
│           └── model.py         # Model loading, batch prediction, amount unscaling
├── frontend/
│   └── src/
│       ├── App.tsx              # Router + auth-aware navbar
│       ├── main.tsx             # AuthProvider + PredictionProvider
│       ├── pages/
│       │   ├── Home.tsx         # Landing page
│       │   ├── Dashboard.tsx    # CSV upload + results
│       │   ├── Demo.tsx         # Sample data predictions
│       │   ├── Login.tsx        # Sign in form
│       │   └── Register.tsx     # Registration with username availability check
│       ├── components/
│       │   ├── FileUpload.tsx   # Drag & drop CSV upload
│       │   ├── SummaryCards.tsx  # Fraud stats overview
│       │   ├── ResultsTable.tsx # Sortable predictions table
│       │   ├── ProbabilityChart.tsx
│       │   └── ProtectedRoute.tsx
│       ├── context/
│       │   ├── AuthContext.tsx   # Auth state (login, logout, session check)
│       │   ├── PredictionContext.tsx
│       │   ├── actions.ts       # Action types + creators
│       │   └── reducers.ts      # Prediction state reducer
│       ├── api/
│       │   └── predict.ts       # Axios client for predictions
│       └── types/
│           └── prediction.ts    # TypeScript interfaces
├── notebooks/
│   ├── 01_fraud_detection_eda.ipynb    # Exploratory data analysis
│   └── 02_preprocessing.ipynb          # SMOTE vs Undersampling vs Class Weights,
│                                       # LR vs RF vs XGBoost cross-validation,
│                                       # Optuna hyperparameter tuning, threshold tuning
├── models/
│   └── xgboost_fraud_detector.joblib   # Trained model artifact
├── data/
│   └── raw/
│       └── creditcard.csv              # Original Kaggle dataset (284,807 transactions)
└── sample_transactions.csv             # 50 sample transactions for demo
```

## ML Pipeline

1. **EDA** — Analyzed 284,807 transactions (492 fraud, 99.83% legitimate)
2. **Preprocessing** — StandardScaler on Amount and Time; V1–V28 already PCA-transformed
3. **Imbalance Handling** — Compared SMOTE, Random Undersampling, and Class Weights (`scale_pos_weight`)
4. **Model Selection** — Cross-validated Logistic Regression, Random Forest, and XGBoost; XGBoost with Class Weights achieved the best F1 (0.86)
5. **Hyperparameter Tuning** — Optuna (10 trials) optimized max_depth, learning_rate, n_estimators, subsample, colsample_bytree, min_child_weight, gamma
6. **Threshold Tuning** — Optimal threshold at 0.6 catches 82/98 frauds with only 15 false alarms
7. **Feature Importance** — All 30 features retained after tier analysis confirmed best performance with full feature set

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/users/check-username/{username}` | Check username availability |
| POST | `/api/users/register` | Create account |
| POST | `/api/users/login` | Sign in (sets httpOnly cookie) |
| POST | `/api/users/logout` | Sign out (clears cookie) |
| GET | `/api/users/me` | Get current user profile |
| PATCH | `/api/users/me` | Update profile |
| DELETE | `/api/users/me` | Delete account |

### Predictions
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/predict/batch` | Upload CSV for batch prediction |
| GET | `/api/sample` | Run predictions on sample data |

## Getting Started

### Prerequisites

- Python 3.11+
- Node.js 18+
- PostgreSQL database (or Supabase project)

### Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

Create a `.env` file in the `backend/` directory:

```env
DATABASE_URL=postgresql://user:password@host:port/dbname
JWT_SECRET=your-secret-key
```

Start the server:

```bash
uvicorn app.main:app --reload
```

The API runs at `http://localhost:8000`.

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The app runs at `http://localhost:5173` and proxies `/api` requests to the backend.

### Dataset

Download the [Credit Card Fraud Detection dataset](https://www.kaggle.com/datasets/mlg-ulb/creditcardfraud) from Kaggle and place it at `data/raw/creditcard.csv`.

## Usage

1. **Register** an account and **log in**
2. Go to **Dashboard** to upload a CSV with columns: V1–V28, Scaled_Amount, Scaled_Time
3. Or try the **Demo** page to see predictions on 50 sample transactions
4. View results: fraud probability, prediction label, and original transaction amount
