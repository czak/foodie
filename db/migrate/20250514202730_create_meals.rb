class CreateMeals < ActiveRecord::Migration[8.0]
  def change
    create_table :meals do |t|
      t.references :user, null: false, foreign_key: true
      t.date :date
      t.string :name
      t.integer :position

      t.timestamps

      t.index [:user_id, :date]
    end
  end
end
