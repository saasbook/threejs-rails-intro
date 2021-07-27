Rails.application.routes.draw do
  get '/' => 'shapes#index'
  #resources :shapes
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
