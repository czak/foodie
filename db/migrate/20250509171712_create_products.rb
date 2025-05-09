class CreateProducts < ActiveRecord::Migration[8.0]
  def change
    create_table :products do |t|
      t.references :user, null: false, foreign_key: true
      t.string :name, null: false
      t.decimal :calories, null: false, precision: 5, scale: 1
      t.decimal :protein, null: false, precision: 5, scale: 1
      t.decimal :fat, null: false, precision: 5, scale: 1
      t.decimal :carbs, null: false, precision: 5, scale: 1
      t.string :portion_type
      t.integer :portion_size
      t.references :next_version, foreign_key: { to_table: :products }

      t.timestamps
    end
  end
end
