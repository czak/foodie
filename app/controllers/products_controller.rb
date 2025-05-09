class ProductsController < ApplicationController
  def index
    @products = Current.user.products
  end
end
