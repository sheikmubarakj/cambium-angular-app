export class MainController {
  constructor ($timeout, webDevTec, toastr, $http, $log) {
    'ngInject';

    this.awesomeThings = [];
    this.classAnimation = '';
    this.creationDate = 1560095886415;
    this.toastr = toastr;

    this.activate($timeout, webDevTec);
    //Define ownership types
    this.ownershipTypes = [{
      name: 'None',
      key: 'NONE'
    },
    {
      name: 'Own',
      key: 'OWN'
    },
    {
      name: 'Rent',
      key: 'RENT'
    },{
      name: 'Mortage',
      key: 'MORTGAGE'
    }];
    
    //Define loan types
    this.loanStatuses = ['None', 'Fully Paid', 'Charged Off', 'Current'];

    //Set none as default option in owership filter
    this.selectedOwnerShip = this.ownershipTypes[0];

    this.pageListCount = [10, 50, 100, 250, 500, 750, 1000];

    //Set none as default option in loan status filter
    this.selectedLoanStatus = this.loanStatuses[0];

    this.filterOwnerShip = (type) => {

      if (type === 'NONE' && this.selectedLoanStatus === 'None') {
        this.filteredResult = this.awesomeThings;
        return;
      }
      let filteredData = this.awesomeThings;

        if (this.selectedLoanStatus !== 'None') {
          filteredData = this.awesomeThings.filter((item) => item['loan_status'] === this.selectedLoanStatus);
        }
     
        if (type === 'NONE') {
          this.filteredResult = filteredData;
          return; 
        }
        this.filteredResult = filteredData.filter((item) => item['home_ownership'] === type)
    }

    this.filterByLoanStatus = (type) => {
      if (type === 'None' && this.selectedOwnerShip.key === 'NONE') {
        this.filteredResult = this.awesomeThings;
        return;
      }

      let _filteredData = this.awesomeThings;

      if (this.selectedOwnerShip.key !== 'NONE') {
        _filteredData = this.awesomeThings.filter((item) => item['home_ownership'] === this.selectedOwnerShip.key);
      }

      if (type === 'None') {
        this.filteredResult = _filteredData;
        return;
      }

      this.filteredResult = _filteredData.filter((item) => item['loan_status'] === type)
    };
    this.selectedPageCount = 10;

    this.getData = () => {
      $http({
        method: 'GET',
        url: '/getLoanDetails',
        params: {
          limit: this.selectedPageCount,
          member_id: this.searchFilter || ''
        }
      }).then((resultSet) => {
      
      this.awesomeThings = resultSet.data.data;
      this.filteredResult = this.awesomeThings;
      this.totalPageCount = resultSet.data.countDocuments;
      this.filterByLoanStatus(this.selectedLoanStatus);
      this.filterOwnerShip(this.selectedOwnerShip.key);
      }, (err) => {
        $log.log({err});
      });
    };
    
    //Call getData method to get list of loan details
    this.getData();

  }

  activate($timeout, webDevTec) {
    this.getWebDevTec(webDevTec);
    $timeout(() => {
      this.classAnimation = 'rubberBand';
    }, 4000);
  }

  getWebDevTec(webDevTec) {
    this.awesomeThings = webDevTec.getTec();

    angular.forEach(this.awesomeThings, (awesomeThing) => {
      awesomeThing.rank = Math.random();
    });
  }

  showToastr() {
    this.toastr.info('Fork <a href="https://github.com/Swiip/generator-gulp-angular" target="_blank"><b>generator-gulp-angular</b></a>');
    this.classAnimation = '';
  }
}
