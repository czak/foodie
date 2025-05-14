class MealsController < ApplicationController
  def index
    @meals = Current.user.meals.where(date: params.expect(:date))
  end
end
