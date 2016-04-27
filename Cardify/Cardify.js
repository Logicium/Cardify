var Cardify = function (DataModel,options){

    this.cards = $('<div>').addClass('cards');
    this.card = $('<div>').addClass('card').addClass('col-xs-4');
    this.cardTitle = $('<div>').addClass('cardTitle');
    this.cardElements = $('<div>').addClass('cardElements');
    this.cardInputs = $('<div>').addClass('cardInputs');
    this.cardPictureContainer = $('<div>').addClass('cardPictureContainer');
    this.cardPicture = $('<img>').addClass('cardPicture');
    this.cardElement = $('<div>').addClass('cardElement');
    this.cardElementName = $('<span>').addClass('cardElementName');
    this.cardElementValue = $('<span>').addClass('cardElementValue');
    this.cardEditInput =  $('<input>').addClass('cardEditInput');
    this.cardEditButton = $('<div>').addClass('cardEditButton');
    this.cardSaveButton = $('<div>').addClass('cardSaveButton');
    this.cardDeleteButton = $('<div>').addClass('cardDeleteButton');
    this.cardButtonContainer = $('<div>').addClass('cardButtonContainer');
    this.cardControlContainer = $('<div>').addClass('cardControlContainer');
    this.DataModel = DataModel;
    this.options = options;


    this.applyPicture();
    this.applyElements();
    this.applyCardControls();
    this.applyElementInputs();
    this.assemble();
    $('.'+this.options.cardsLocation).append(this.cards);

};

Cardify.prototype = {

    applyTitle: function(){
        $(this.cardTitle).text(this.DataModel[_.find(this.DataModel,{'key':'Name'})]);
    },

    styleFirstElement: function(){

    },

    applyPicture: function(){
        var pictureURL = _.find(this.DataModel,{'key':'Image'}).value;
        console.log(pictureURL);
        this.cardPicture.css('background-image', 'url(' + pictureURL + ')');
        this.cardElements.prepend(this.cardPictureContainer.clone().append(this.cardPicture));
    },

    applyElements: function(){
        for(var i=0;i<this.DataModel.length;i++){
            if(this.DataModel[i]['key']=="Image"){continue;}
            if(this.DataModel[i]['hidden']==true){continue;}
            var newCardElement = $(this.cardElement).clone();
            var newElementName = $(this.cardElementName).clone().text(this.DataModel[i]['key']+": ");
            var newElementValue =$(this.cardElementValue).clone().text(this.DataModel[i]['value']);
            $(newCardElement).append(newElementName.append(newElementValue));
            $(this.cardElements).append(newCardElement);
        }
    },

    applyCardControls: function() {
        var newButtonContainer = $(this.cardButtonContainer).clone();
        var newEditButton = $(this.cardEditButton).clone().text('Edit').addClass('button ghost lg');
        var newSaveButton = $(this.cardSaveButton).clone().text('Save').addClass('button ghost lg').hide();
        var newDeleteButton = $(this.cardDeleteButton).clone().text('Delete').addClass('button cta lg');
        newEditButton.click(this.editButtonClick);
        newSaveButton.click(this.saveButtonClick);
        newDeleteButton.click(this.deleteButtonClick);
        this.cardControlContainer.append(newButtonContainer.clone().append(newEditButton).append(newSaveButton).addClass('col-xs-6'));
        this.cardControlContainer.append(newButtonContainer.clone().append(newDeleteButton).addClass('col-xs-6'));
    },

    editButtonClick: function(){
      //Hide the card elements
        console.log("Edit button clicked");
        var $this = $(this);
        var parent = $(this).closest('.card');
        parent.find('.cardElements').hide();
        parent.find('.cardInputs').fadeIn();
        parent.find('.cardEditButton').hide();
        parent.find('.cardSaveButton').fadeIn();
    },

    saveButtonClick: function(){
        //Ajax post
        var $this = $(this);
        var parent = $this.closest('.card');
        var cardData = parent.data('data');
        $.post(
            //this.options.postEditAddress,
            //cardData,
            //function(){
            //    console.log("Card has been saved. :)");
            //},
            //'json'
        ).always(function(){
            parent.find('.cardInputs').hide();
            parent.find('.cardElements').fadeIn();
            parent.find('.cardSaveButton').hide();
            parent.find('.cardEditButton').fadeIn();
        });
    },

    deleteButtonClick:function(){
        //Sweetalert deletion confirmation
        var $this = $(this);
        swal({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
            closeOnConfirm: false
        }).then(function(isConfirm) {
            if (isConfirm) {
                swal(
                    'Deleted!',
                    'Your file has been deleted.',
                    'success'
                );
            }
        })
    },

    applyElementInputs: function(){
        for(var i=0;i<this.DataModel.length;i++){
            if(this.DataModel[i]['hidden']==true){continue;}
            var newCardEditInput = $(this.cardEditInput).clone();
            newCardEditInput.attr('placeholder',this.DataModel[i]['key']);
            newCardEditInput.val(this.DataModel[i]['value']);
            newCardEditInput.addClass('button ghost lg');
            $(this.cardInputs).append(newCardEditInput);
            $(this.cardInputs).hide();
        }
    },

    assemble: function(){
        $(this.card).append(this.cardTitle);
        $(this.card).append(this.cardElements);
        $(this.card).append(this.cardInputs);
        $(this.card).append(this.cardControlContainer);
        $(this.cards).append(this.card);
    },

};

function findParent(element,parentClass){
    var nextParent = $(element).parent();
    console.log(nextParent);
    if(nextParent.hasClass(parentClass)){return nextParent;}
    else{findParent(nextParent,parentClass)}
}

var Pager = function (inputArray, pageSize) {
    this.input = $('<input>');
    this.page = $('<div>');
    this.card = $('<div>');
    this.cards =$('<div>');
    this.pages = $('<div>').addClass('pager');
    $(this.page).data('inputData', []);
    this.pageNumber = 0;
    this.activePage = 0;

    while (inputArray.length > 0) {

        var arraySplit = inputArray.splice(0, pageSize);
        console.log(arraySplit);
        var newPage = $(this.page).clone();
        newPage.data('inputData', []);
        newPage.data('inputData').push(arraySplit);
        newPage.data('pageNumber', this.pageNumber);
        newPage.addClass(this.formatPageNumberToClass(this.pageNumber));
        newPage.addClass('pager-page');
        this.processNewInputs(newPage);
        $(this.pages).append(newPage);
        this.pageNumber++;
    }
    $('body').append(this.pages);
    this.applyStyles();
    this.addNavigation();
    this.assignButtons();
    this.addSubmitButton();
};

Pager.prototype = {

    processNewInputs: function (pageWithInputs) {

        for (var i = 0; i < $(pageWithInputs).data('inputData')[0].length; i++) {
            var newInput = $(this.input).clone();
            $(newInput).addClass(this.formatPageNumberToClass($(pageWithInputs).data('pageNumber')));
            $(newInput).addClass('button md ghost');
            //console.log($(pageWithInputs).data('inputData')[0][i]['name']);
            newInput.attr('placeholder', $(pageWithInputs).data('inputData')[0][i]['name']);
            pageWithInputs.append(newInput);
        }
    },
    formatPageNumberToClass: function (pageNumber) {
        pageNumber = pageNumber.toString();
        var pageNumberClass = ("page-" + pageNumber);
        return pageNumberClass;
    },
    applyStyles: function () {
        $('.pager').find('div.pager-page').not('.page-0').hide();
        $('.pager-navi').show();
    },
    addNavigation: function () {
        var navi = $('<div>');
        navi.addClass('pager-navi text-center');
        var backButtonContainer = $('<div>').addClass('col-xs-6');
        var backButton = $('<div>').addClass('pager-back-button button ghost');
        backButton.append('<i class="fa fa-chevron-left" aria-hidden="true"></i>');
        backButtonContainer.append(backButton);

        var forwardButtonContainer = $('<div>').addClass('col-xs-6');
        var forwardButton = $('<div>').addClass('pager-forward-button button ghost');
        forwardButton.append('<i class="fa fa-chevron-right" aria-hidden="true"></i>');
        forwardButtonContainer.append(forwardButton);

        navi.append(backButtonContainer);
        navi.append(forwardButtonContainer);

        $('.pager').append(navi);
    },
    assignButtons: function () {
        var activePage = this.activePage;
        $('.pager-back-button').click(function () {
            var lastPage = formatPageNumber(--activePage);
            console.log(lastPage);
            $('.pager').find('div.pager-page').not('.' + lastPage).hide();
            $('.pager').find('div.pager-page' + ('.' + lastPage)).fadeIn();
        });

        $('.pager-forward-button').click(function () {
            var nextPage = formatPageNumber(++activePage);
            console.log(nextPage);
            $('.pager').find('div.pager-page').not('.' + nextPage).hide();
            $('.pager').find('div.pager-page' + ('.' + nextPage)).fadeIn();
        });
    },
    addSubmitButton: function () {
        var lastPageIndex = $('.pager').find('.pager-page').length;
        var submitButton = $('<div>').addClass('pager-submit-button button cta md');
        submitButton.text("Submit");
        $(submitButton).click(function () {
            console.log("Theoretically, I've submitted your post for you. :)");
            //Post values to whoever you want
        });
        $($('.pager').find('.pager-page')[lastPageIndex - 1]).append(submitButton);
    }
};

function formatPageNumber(pageNumber) {
    pageNumber = pageNumber.toString();
    var pageNumberClass = ("page-" + pageNumber);
    return pageNumberClass;
}