class AddTargetsToUsers < ActiveRecord::Migration[8.0]
  def change
    add_column :users, :target_calories, :integer
    add_column :users, :target_protein, :integer
    add_column :users, :target_fat, :integer
    add_column :users, :target_carbs, :integer
  end
end
