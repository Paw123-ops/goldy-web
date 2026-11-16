export interface ProjectMeta {
  app_name: string;
  full_title: string;
  thesis_title: string;
  author: string;
  academic_degree: string;
  last_updated: string;
}

export interface MarketSummary {
  last_date: string;
  silver_usd: number;
  silver_idr_per_gram: number;
  silver_change_pct: number;
  gold_usd: number;
  gold_silver_ratio: number;
  dxy_index: number;
  crude_oil_usd: number;
  us10y_yield: number;
  tips_etf: number;
  sp500_index: number;
  usd_idr: number;
  vix_index: number;
}

export interface ForecastCard {
  horizon_label: string;
  target_days: number;
  target_date_label: string;
  predicted_price: number;
  predicted_idr: number;
  delta: number;
  delta_pct: number;
  lower_bound_95: number;
  upper_bound_95: number;
  mape: number;
  r2: number;
  signal: string;
  confidence_level: string;
  recommendation: string;
}

export interface ForwardProjectionItem {
  day: number;
  date: string;
  display_date: string;
  predicted_price: number;
  lower_bound_95: number;
  upper_bound_95: number;
}

export interface HistoricalChartItem {
  date: string;
  display_date: string;
  actual: number;
  rf_pred: number;
  linear_pred: number;
  gold: number;
  dxy: number;
}

export interface MetricItem {
  horizon: string;
  horizon_code: string;
  role: string;
  model: string;
  mae: number;
  rmse: number;
  mape: number;
  r2: number;
  status: string;
}

export interface FeatureImportanceItem {
  feature: string;
  importance_1d: number;
  importance_7d: number;
  importance_30d: number;
  desc: string;
}

export interface GoldyMarketData {
  project_meta: ProjectMeta;
  market_summary: MarketSummary;
  forecast_cards: {
    "1d": ForecastCard;
    "7d": ForecastCard;
    "30d": ForecastCard;
  };
  forward_projection: ForwardProjectionItem[];
  historical_chart: HistoricalChartItem[];
  metrics_table: MetricItem[];
  feature_importances: FeatureImportanceItem[];
}

