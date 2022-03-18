module.exports = function(sequelize,Sequelize){
    return  sequelize.define('events',{
       event_id:{
            type:Sequelize.DataTypes.UUID,
            defaultvalue: Sequelize.DataTypes.UUIDV4,
            primaryKey:true,
            allowNull: false,
        },
        name:{
            type:Sequelize.DataTypes.STRING(40),
            allowNull:true
        },
        place:{
            type:Sequelize.DataTypes.STRING(40),
            allowNull:false
        },
        
        created_by:{
            type:Sequelize.DataTypes.STRING(70),
            allowNull:false
        },
        email:{
            type:Sequelize.DataTypes.STRING(70)           ,
            allowNull:false
        },
        user_id:{
            type:Sequelize.DataTypes.STRING(70),
            allowNull:true,
            
        }
    },{
        timeStamp:false,
        tableName:'events',
        freezeTableName: true
    });
};