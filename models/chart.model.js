module.exports = (sequelize, Model, DataTypes, db) => {

  class Chart extends Model {}
  
  Chart.init({
    name: DataTypes.STRING,
    age: DataTypes.STRING,
    gender: DataTypes.CHAR    
  }, { sequelize, modelName: 'chart' });

  (async () => {
		await sequelize.sync();
    const data = await Chart.findOne({ where: { name : 'Rubi' } });
    if(!data){      
			Chart.bulkCreate(
				[
					{
							"name" : "Rubi",
							"age" : 31,
							"gender" : "F"
					},
					{
							"name" : "Randy",
							"age" : 32,
							"gender" : "M"
					},
					{
							"name" : "Apple",
							"age" : 18,
							"gender" : "F"
					},
					{
							"name" : "Mango",
							"age" : 14,
							"gender" : "F"
					},
					{
							"name" : "Ferry",
							"age" : 37,
							"gender" : "M"    
					},
					{ 
							"name" : "Johnson",
							"age" : 55,
							"gender" : "M"
					},
					{ 
							"name" : "Larry",
							"age" : 45,
							"gender" : "M"
					},
					{ 
							"name" : "Ryne",
							"age" : 12, 
							"gender" : "F"
					},
					{ 
							"name" : "Christopher",
							"age" : 24,
							"gender" : "M"
					}
				]
			)
    }    
  })();
	
  return Chart
}