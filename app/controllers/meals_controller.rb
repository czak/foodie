class MealsController < ApplicationController
  before_action :set_date
  before_action :set_meals, only: [:index, :show]

  def show
    @meal = @meals.find(params[:id])
  end

  def new
    @meal = Meal.new
  end

  def create
    @meal = Current.user.meals.build(meal_params)
    @meal.date = @date

    if @meal.save
      redirect_to meals_path, notice: "Meal created"
    else
      render :new, status: :unprocessable_entity
    end
  end

  private

  def set_date
    @date = Date.iso8601(params.expect(:date))
  rescue
    redirect_to root_path
  end

  def set_meals
    @meals = Current.user.meals.where(date: @date)
  end

  def meal_params
    params.require(:meal).permit(:name, :position)
  end
end
