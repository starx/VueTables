Vue.config.debug = true;
new Vue({
  el: '#app',
  data: {
    page: 1,
    page_limit: 5,
    page_limit_options: [5, 10, 25, 100],
    filter_text: '',
    data:[]
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
    	if(this.filter_text.length) {
      	var filter_text = this.filter_text;
      	return this.data.filter(function(row) {
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
  	}
  },
  ready: function() {    
    var that = this;
    //this.selectedType = this.types[0];
    setInterval(function() {
    	var row_date = faker.date.past();
      row_date = row_date.getFullYear() + "-" + row_date.getMonth() + "-" + row_date.getDate();
      
      that.data.push({
      	id: faker.random.number(),
        date: row_date,
      	name: faker.name.findName(),
        url: faker.internet.url(),
      	moreData: faker.company.companyName()
    	});
    }, 3000);
  },
});