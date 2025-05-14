Rails.application.routes.draw do
  root "dashboard#show"

  resource :session

  resources :products
  resources :recipes
  resources :statistics
  resources :settings

  get "up" => "rails/health#show", as: :rails_health_check
end
