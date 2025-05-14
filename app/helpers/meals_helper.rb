module MealsHelper
  def weekday_link(date)
    classes = %w(py-2 flex-1 hover:bg-gray-100 flex flex-col items-center justify-center rounded-sm)
    classes += %w(bg-lime-600 text-white hover:bg-lime-600) if date == @date

    weekday = date.strftime("%a")
    day = date.day

    link_to meals_path(date), class: classes do
      tag.span(weekday, class: "text-xs") + tag.span(day, class: "text-lg font-semibold")
    end
  end
end
