class MealsController < ApplicationController
  before_action :set_date

  def index
    @meals = Current.user.meals.where(date: @date)
  end

  private

  def set_date
    @date = Date.iso8601(params.expect(:date))
  rescue
    redirect_to root_path
  end
end
