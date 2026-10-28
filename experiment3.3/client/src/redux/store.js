import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
  persistStore, persistReducer,
  FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

import authReducer from "./authSlice";
import postsReducer from "./postsSlice";
import draftsReducer from "./draftsSlice";
import platformsReducer from "./platformsSlice";
import calendarReducer from "./calendarSlice";
import adminReducer from "./adminSlice";

const authPersistConfig = { key: "auth", storage, whitelist: ["user", "token"] };

const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  posts: postsReducer,
  drafts: draftsReducer,
  platforms: platformsReducer,
  calendar: calendarReducer,
  admin: adminReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);