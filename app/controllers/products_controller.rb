class ProductsController < ApplicationController
  before_action :set_product, only: %i[ edit update destroy ]

  def index
    @products = Current.user.products.order(:name)
  end

  def new
    @product = Product.new
  end

  def create
    @product = Current.user.products.build(product_params)

    if @product.save
      redirect_to products_path, notice: "Product created"
    else
      render :new, status: :unprocessable_entity
    end
  end

  def edit
  end

  def update
    if @product.update(product_params)
      redirect_to products_path, notice: "Product updated"
    else
      render :edit, status: :unprocessable_entity
    end
  end

  def destroy
    @product.destroy!
    redirect_to products_path, status: :see_other, notice: "Product destroyed"
  end

  private

  def set_product
    @product = Product.find(params.expect(:id))
  end

  def product_params
    params.expect(product: [ :name, :calories, :protein, :fat, :carbs, :portion_type, :portion_size ])
  end
end
