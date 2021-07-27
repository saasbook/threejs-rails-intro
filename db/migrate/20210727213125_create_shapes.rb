class CreateShapes < ActiveRecord::Migration[6.1]
  def change
    create_table :shapes do |t|
      t.string :name

      t.timestamps
    end
  end
end
