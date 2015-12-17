var actions = ['add', 'modify', 'delete'];
setInterval(function() {
    var vueTablesDataSource = Lockr.get('VueTablesDataSource', []);
    //console.log(vueTablesDataSource);
    var action = actions[Math.floor(Math.random()*actions.length)];
    switch(action) {
        case "modify":
            var key = Math.floor(Math.random()*vueTablesDataSource.length);
            var data_row = vueTablesDataSource[key];

            var row_date = faker.date.past();
            row_date = row_date.getFullYear() + "-" + row_date.getMonth() + "-" + row_date.getDate();
            data_row.date = row_date;
            data_row.name = faker.name.findName(),
            data_row.url = faker.internet.url(),
            data_row.company = faker.company.companyName()
            vueTablesDataSource[key] = data_row;
            Lockr.set('VueTablesDataSource', vueTablesDataSource);
        break;
        case "delete":
            var data_row = vueTablesDataSource[Math.floor(Math.random()*vueTablesDataSource.length)];
            Lockr.srem('VueTablesDataSource', data_row);
        break;
        case "add":
            var row_date = faker.date.past();
            row_date = row_date.getFullYear() + "-" + row_date.getMonth() + "-" + row_date.getDate();
            var data = {
                id: faker.random.number(),
                date: row_date,
                name: faker.name.findName(),
                url: faker.internet.url(),
                company: faker.company.companyName()
            };
            //console.log(data);
            Lockr.sadd('VueTablesDataSource', data);        
        break;
    }
}, 3000);