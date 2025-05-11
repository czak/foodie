class CreateProducts < ActiveRecord::Migration[8.0]
  def change
    create_table :products do |t|
      t.references :user, null: false, foreign_key: true
      t.string :name, null: false
      t.integer :calories, null: false
      t.decimal :protein, precision: 5, scale: 2, null: false
      t.decimal :fat, precision: 5, scale: 2, null: false
      t.decimal :carbs, precision: 5, scale: 2, null: false
      t.string :portion_type
      t.integer :portion_size
      t.references :next_version, foreign_key: { to_table: :products }

      t.timestamps
    end
  end
end
