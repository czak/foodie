Rails.application.routes.draw do
  root to: redirect { "/#{Date.today.iso8601}/meals" }

  resource :session

  resources :products
  resources :recipes
  resources :statistics
  resources :settings

  scope "/:date" do
    resources :meals
  end

  get "up" => "rails/health#show", as: :rails_health_check
end
