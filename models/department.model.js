module.exports = (sequelize, Model, DataTypes, db) => {

    class Department extends Model {}
    
    Department.init({
      code: DataTypes.STRING,
      description: DataTypes.STRING,
      ts : DataTypes.INTEGER 
    }, { sequelize, modelName: 'department' });

    (async () => {
      await sequelize.sync();
      const data = await Department.findOne({ where: { code : 'IT' } });
      if(!data){      
        Department.bulkCreate(
          [
            {
              code : 'IT',
              description : 'IT department'
            },
            {
              code : 'HR',
              description : 'Human Resourse department'
            },
            {
              code : 'SOC',
              description : 'SOC department'
            },
            {
              code : 'DBA',
              description : 'Database Administrator department'
            }
          ]
        )
      }    
    })();

    return Department;
  
} 