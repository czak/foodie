Rails.application.routes.draw do
  root "dashboard#show"

  resource :session

  resources :products

  get "up" => "rails/health#show", as: :rails_health_check
end
