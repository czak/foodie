module ApplicationHelper
  def nav_link_to(name, url, controller)
    classes = %w[material-icon p-2 hover:text-white rounded-sm]
    classes += %w[text-white bg-lime-600] if params[:controller] == controller

    link_to name, url, class: classes
  end
end
