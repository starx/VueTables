var actions = ['add', 'modify', 'delete'];
setInterval(function() {
    var vueTablesDataSource = Lockr.get('VueTablesDataSource', []);
    var action = actions[Math.floor(Math.random()*actions.length)];
    switch(action) {
        case "add":
            var row_date = faker.date.past();
            row_date = row_date.getFullYear() + "-" + row_date.getMonth() + "-" + row_date.getDate();
            Lockr.sadd('VueTablesDataSource', {
                id: faker.random.number(),
                date: row_date,
                name: faker.name.findName(),
                url: faker.internet.url(),
                company: faker.company.companyName()
            });        
        break;
    }
}, 100);
