Vue.config.debug = true;
function dynamicSort(property) {
    var sortOrder = 1;
    if(property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a,b) {
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
}

new Vue({
    el: '#app',
    data: {
        page: 1,
        page_limit: 10,
        page_limit_options: [5, 10, 25, 100],
        filter_text: '',
        data:[],
        show_first:false,
        show_last:false,
        table_headers:['Id','Date','Edit','Name','Company','Actions'],
        sorting:'',
        sorting_order:'desc'
    },
    computed: {

        range_start: function() {
            return (this.page-1) * this.page_limit;
        },
        range_end: function() {
            return this.page * this.page_limit;
        },
        page_count: function() {
            return Math.ceil(this.tableData.length/this.page_limit);
        },
        pagination_range: function() {
            var start = this.page > 3 ? this.page-3 : 1;
            var end = this.page+3 > this.page_count ? this.page_count + 1 : this.page+3;
            return _.range(start, end);
        },
        next_page: function() {
            return this.page + 1 > this.page_count ?
                this.page_count :
            this.page + 1;
        },
        prev_page: function() {
            return this.page-1 > 1 ? this.page-1 : 1;
        },
        tableData: function() {
            this.data = _.sortBy( this.data, this.sorting.toLowerCase());
            if(this.sorting_order == 'asc'){
                this.data = this.data.reverse();
            }
            if(this.filter_text.length) {
                var filter_text = this.filter_text;
                var filtered_data = this.data.filter(function(row) {
                    var rowValues = _.values(row);
                    var found = false;
                    rowValues.every(function(fieldValue) {
                        if(fieldValue.toString().indexOf(filter_text) >= 0) {
                            found = true;
                            return false;
                        }
                        return true;
                    });
                    return found;
                });

                return filtered_data;
            }
            return this.data;
        },
        rowData: function() {
            return this.tableData.slice(this.range_start, this.range_end);
        }
    },
    methods: {
        changePage: function(event) {
            var el = event.target;
            var requestedPage = el.getAttribute('data-page');
            this.page = parseInt(requestedPage);
            if(this.page_count > this.page + 2){
                this.show_last = true;
            }else{
                this.show_last = false;
            }
            if(this.page > this.page_limit  ){
                this.show_first = true;
            }else{
                this.show_first = false;
            }
        },
        changeOrder:function(e){
            var el = e.target;
            var ordering = el.getAttribute('data-ordering');
            if(ordering == this.sorting){
                this.sorting_order = this.sorting_order == 'asc'?'desc':'asc';
            }else{
                this.sorting = ordering;
                this.sorting_order = 'desc';
            }

            console.log(this.sorting)
            console.info(this.sorting_order)
        },
        resetView:function(){
            if(this.page>this.page_count){
                this.page = this.page_count;
                this.show_first = true;
            }
            this.show_first = true;
            this.show_last = false;
        }
    },

    ready: function() {
        var that = this;
        //this.selectedType = this.types[0];
        //setInterval(function() {
        //	var row_date = faker.date.past();
        //  row_date = row_date.getFullYear() + "-" + row_date.getMonth() + "-" + row_date.getDate();
        //
        //  that.data.push({
        //  	id: faker.random.number(),
        //    date: row_date,
        //  	name: faker.name.findName(),
        //    url: faker.internet.url(),
        //  	moreData: faker.company.companyName()
        //	});
        //}, 3000);
        for (i = 0; i < 1000; i++) {
            var row_date = faker.date.past();
            row_date = row_date.getFullYear() + "-" + row_date.getMonth() + "-" + row_date.getDate();
            that.data.push({
                id: faker.random.number(),
                date: row_date,
                name: faker.name.findName(),
                url: faker.internet.url(),
                company: faker.company.companyName()
            })
        };

        if(this.page_count > this.range_end){
            this.show_last = true;
        }
        this.sorting = this.table_headers[0]
        this.data = _.sortBy(this.data,this.sorting.toLowerCase());
        console.log(this.sorting);
    },
});