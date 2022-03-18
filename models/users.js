module.exports = function(sequelize,Sequelize){
    return  sequelize.define('users',{
       user_id:{
            type:Sequelize.DataTypes.UUID,
            defaultvalue: Sequelize.DataTypes.UUIDV4,
            primaryKey:true,
            allowNull: false,
        },
        name:{
            type:Sequelize.DataTypes.STRING(40),
            allowNull:true
        },
        email:{
            type:Sequelize.DataTypes.STRING(40),
            allowNull:false
        },
        
        password:{
            type:Sequelize.DataTypes.STRING(70),
            allowNull:false
        },
        age:{
            type:Sequelize.DataTypes.INTEGER            ,
            allowNull:true,
            defaultValue:25
        },
        image:{
            type:Sequelize.DataTypes.STRING(70),
            allowNull:true,
            
        },
        gender:{
            type:Sequelize.DataTypes.STRING(20),
            allowNull:true,
            defaultValue:'male'
            
        },
        dob:{
            type:Sequelize.DataTypes.STRING(40),
            allowNull:true,
            
        },
    },{
        timeStamp:false,
        tableName:'users',
        freezeTableName: true
    });
};