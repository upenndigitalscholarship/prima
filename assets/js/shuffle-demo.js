var Shuffle = window.Shuffle;

class Prima {
  constructor(element) {
    this.element = element;
    this.shuffle = new Shuffle(element, {
      itemSelector: '.picture-item',
      sizer: element.querySelector('.my-sizer-element'),
    });
    this.shuffle.options.filterMode = Shuffle.FilterMode.ALL;
    // Log events.
    this._activeFilters = [];
    this.addFilterButtons();
    this.addSorting();
    this.addSearchFilter();
  }


  addFilterButtons() {
    const options = document.querySelector('.filter-options');
    if (!options) {
      return;
    }
    
    const filterButtons = Array.from(options.children);
    const checkboxes = options.querySelectorAll(":scope > input");
    const onClick = this._handleFilterClick.bind(this);
    checkboxes.forEach((button) => {
      button.addEventListener('click', onClick, false);
    });
    filterButtons.forEach((button) => {
      button.addEventListener('click', onClick, false);
    });
  }

  _handleFilterClick(evt) {
    
    const btn = evt.currentTarget;
    const isActive = btn.classList.contains('active');
    const btnGroup = btn.getAttribute('data-group');

    this._removeActiveClassFromChildren(btn.parentNode);
    
    let filterGroup;
    if (isActive) {
      btn.classList.remove('active');
      filterGroup = Shuffle.ALL_ITEMS;
    } else {
      btn.classList.add('active');
      filterGroup = btnGroup;
    }
    // get an array of the currently active filters
    let currentFilters = Array.from(document.querySelectorAll('.filter-options input:checked')).map((el) => el.value);
    // .filter(['space', 'nature']);
    this.shuffle.filter(currentFilters);

    // add sort
    // if btnGroup  is vocab 

    if (btnGroup === 'vocab') {
      // select all with class vocab-display
      let vocabDisplay = document.querySelectorAll('.vocab-display');
      // loop through each element and make it visible
      vocabDisplay.forEach((element) => {
        element.style.display = 'block';
      });
      // select all with class grammar-display
      let grammarDisplay = document.querySelectorAll('.grammar-display');
      // loop through each element and hide it
      grammarDisplay.forEach((element) => {
        element.style.display = 'none';
      });
      // select all with class culture-display
      let cultureDisplay = document.querySelectorAll('.culture-display');
      // loop through each element and hide it
      cultureDisplay.forEach((element) => {
        element.style.display = 'none';
      });
      this.shuffle.sort({
        by: this._sortByVocab,
      });
    }
  }

  _sortByVocab(element) {
    return element.getAttribute('data-vocab');
  }
  _removeActiveClassFromChildren(parent) {
    const { children } = parent;
    for (let i = children.length - 1; i >= 0; i--) {
      children[i].classList.remove('active');
    }
  }

  addSorting() {
    const buttonGroup = document.querySelector('.sort-options');
    if (!buttonGroup) {
      return;
    }
    buttonGroup.addEventListener('change', this._handleSortChange.bind(this));
  }

  _handleSortChange(evt) {
    // Add and remove `active` class from buttons.
    const buttons = Array.from(evt.currentTarget.children);
    buttons.forEach((button) => {
      if (button.querySelector('input').value === evt.target.value) {
        button.classList.add('active');
      } else {
        button.classList.remove('active');
      }
    });
    
    // Create the sort options to give to Shuffle.
    const { value } = evt.target;
    let options = {};
    
    function sortByGrammar(element) {
      return element.getAttribute('data-grammar');
    }

    function sortByVocab(element) {
      return element.getAttribute('data-vocab');
    }
    
    function sortByCulture(element) {
      return element.getAttribute('data-culture');
    }
    
    if (value === 'date-created') {
      options = {
        reverse: true,
        by: sortByDate,
      };
    } else if (value === 'title') {
      options = {
        by: sortByTitle,
      };
    }
    this.shuffle.sort(options);
  }

  // Advanced filtering
  addSearchFilter() {
    const searchInput = document.querySelector('.js-shuffle-search');
    if (!searchInput) {
      return;
    }
    searchInput.addEventListener('keyup', this._handleSearchKeyup.bind(this));
  }

  /**
   * Filter the shuffle instance by items with a title that matches the search input.
   * @param {Event} evt Event object.
   */
  _handleSearchKeyup(evt) {
    const searchText = evt.target.value.toLowerCase();
    this.shuffle.filter((element, shuffle) => {
      // If there is a current filter applied, ignore elements that don't match it.
      if (shuffle.group !== Shuffle.ALL_ITEMS) {
        // Get the item's groups.
        const groups = JSON.parse(element.getAttribute('data-groups'));
        const isElementInCurrentGroup = groups.indexOf(shuffle.group) !== -1;
        // Only search elements in the current group
        if (!isElementInCurrentGroup) {
          return false;
        }
      }
      const titleElement = element.querySelector('.picture-item__title');
      const titleText = titleElement.textContent.toLowerCase().trim();
      return titleText.indexOf(searchText) !== -1;
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.demo = new Prima(document.getElementById('grid'));
  //get arguments from url
  let url = new URL(window.location.href);
  let filter = url.searchParams.get("filter");
  if (filter){
    //get filter button
    let filterButton = document.querySelector(`.filter-options [data-group="${filter}"]`);
    //click filter button
    filterButton.click();
  }
  let search = url.searchParams.get("q");
  if (search){
    //get search input
    let searchInput = document.querySelector(`.js-shuffle-search`);
    //set search input value
    searchInput.value = search;
    //trigger search
    searchInput.dispatchEvent(new Event('keyup'));
  }
  let sort = url.searchParams.get("sort");
  if (sort){
    //get sort button
    let sortButton = document.querySelector(`.sort-options [value="${sort}"]`);
    //click sort button
    sortButton.click();
  }
});
