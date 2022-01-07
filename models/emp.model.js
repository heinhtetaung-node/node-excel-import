module.exports = (sequelize, Model, DataTypes, db) => {

    class Employee extends Model {}
    
    Employee.init({
      empName: DataTypes.STRING,
      empNo: DataTypes.STRING,
      empDob: DataTypes.DATE,
      joinDate: DataTypes.DATE,
      departmentId: DataTypes.INTEGER,
      salary: DataTypes.DOUBLE,
      skills: DataTypes.STRING,
      ts : DataTypes.INTEGER 
    }, { sequelize, modelName: 'employee' });
  
    return Employee;
} 