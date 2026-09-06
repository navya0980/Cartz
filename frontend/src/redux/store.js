import { configureStore, combineReducers } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import productReducer from "./productSlice"

import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";

// This tells Redux Persist "Use browser localStorage."
import storageModule from "redux-persist/lib/storage";

const storage = storageModule.default || storageModule;

// This is simply a configuration object.
// Think of it as Redux Persist Settings
// Save as:
// root
// Store in:
// localStorage

const persistConfig = {
  key: "cartz",
  storage,
};

const rootReducer = combineReducers({
  user: userReducer,
  product:productReducer
});


const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// This starts Redux Persist.
export const persistor = persistStore(store);

// This is the most important line.
// const persistedReducer = persistReducer(persistConfig, rootReducer);
// Normally Redux uses

// rootReducer

// Now Redux Persist wraps it.

// Imagine

// Before

// Redux
//    ↓
// rootReducer

// After

// Redux
//    ↓
// Persist Wrapper
//    ↓
// rootReducer

// Now every action passes through Redux Persist first.

// Example

// dispatch(setUser())

// ↓

// Redux Persist sees it

// ↓

// updates Redux

// ↓

// saves into localStorage



// PERSISTGATE

// PersistGate fixes this.

// App starts

// ↓

// PersistGate waits

// ↓

// Read localStorage

// ↓

// Restore Redux

// ↓

// Now render App

// So your app only renders after Redux has been restored.

// That's why the prop is called

// loading={null}

// Meaning

// While restoring

// ↓

// show nothing