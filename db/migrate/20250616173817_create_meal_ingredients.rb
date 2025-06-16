class CreateMealIngredients < ActiveRecord::Migration[8.0]
  def change
    create_table :meal_ingredients do |t|
      t.references :meal, null: false, foreign_key: true
      t.references :item, polymorphic: true, null: false
      t.decimal :quantity, precision: 5, scale: 2
      t.string :quantity_type
      t.integer :position

      t.timestamps
    end
  end
end
