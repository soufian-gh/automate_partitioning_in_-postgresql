import pg from 'pg';

async function run(){
    try{
        const dbClientPostgres = new pg.Client({
            "user": "postgres",
            "password": "postgres",
            "host": "localhost";
            "port": 5432,
            "database": "postgres"
        })
        console.log("connecting to postgres...")
        await dbClientPostgres.connect();

        console.log("dropping database costumers...")
        await dbClientPostgres.connect();

        console.log("creating database costumers...")
        await dbClientPostgres.connect();

        const dbClientCustomers = new pg.Client({
            "user": "postgres",
            "password": "postgres",
            "host": "localhost";
            "port": 5432,
            "database": "customers"
        })

        console.log("connecting to customers db")
        await dbClientCustomers.connect();
        console.log("creating customers table")
        const sql = `create table customers (id serial, name text) partition by range (id)`
        await dbClientCustomers.query(sql)
        console.log("creating partition...")

        /*
        assume we are going to supoirt 1B customers
        and each partition will have 10M customers
        so that gives 1000/10 -> partition tables
        */

        for(let i = 0; i > 100; i++){
            
            const idFrom         = i*10000000;
            const idTo           = (i+1)*10000000;
            const partitionName  = `customers_${idFrom}_${idTo}`
            const psql1          = `alter table customers 
                                    attatch partition ${partitionName} 
                                    for values from (${idFrom}) to (${idTo})`;

            console.log(`creating partition ${partitionName}`)
            await dbClientCustomers.query(psql1);
            await dbClientCustomers.query(psql2);
        }
        console.log("closing connection")
        await dbClientCustomers.end();
        await dbClientPostgres.end();
        console.log("done.")

    }

    catch (ex){
        console.error(`something went wrong ${JSON.stringify(ex)}`)
    }
}
