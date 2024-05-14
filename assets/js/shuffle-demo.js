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
    this._gridSize = 6
    this.itemBackup = this.shuffle.items
    this.addFilterButtons();
    this.addSorting();
    this.addSearchFilter();
    this._pagination(this._gridSize);
  }
  _getItems() {
    return Array.from(this.element.children)
      .filter((el) => el.matches(this.options.itemSelector))
      .map((el) => new ShuffleItem(el, this.options.isRTL));
  }

  _addDataItem(json_data) {
    // a function to create a new ShuffleItem and add it to shuffle.items from JSON data
    let parentNode = document.getElementById('grid');
    // create a new child (figure element) of grid
    let newElement = document.createElement('figure');
    parentNode.appendChild(newElement);

    newElement.classList.add('col-5@xs', 'col-5@sm', 'col-4@md', 'picture-item', 'picture-item--h2', 'shuffle-item', 'shuffle-item--visible');
    newElement.setAttribute('onclick', 'window.location.href =' + json_data["url"]);
    // add data-title attribute
    newElement.setAttribute('data-title', json_data.clip_name);
    newElement.setAttribute('data-grammar', json_data.grammar);
    newElement.setAttribute('data-vocab',   json_data.vocab);
    newElement.setAttribute('data-culture', json_data.culture);
    newElement.setAttribute('data-index',   json_data.index);
    let innerElement = document.createElement('div');
    innerElement.classList.add('picture-item__inner');
    newElement.appendChild(innerElement);
    let aspectElement = document.createElement('div');
    aspectElement.classList.add('aspect', 'aspect--16x9');
    innerElement.appendChild(aspectElement);
    let aspectInnerElement = document.createElement('div');
    aspectInnerElement.classList.add('aspect__inner');
    aspectElement.appendChild(aspectInnerElement);
    let imgElement = document.createElement('img');
    imgElement.setAttribute('src', json_data.thumbnail);
    imgElement.setAttribute('alt', json_data.clip_name);
    aspectInnerElement.appendChild(imgElement);
    let detailsElement = document.createElement('div');
    detailsElement.classList.add('picture-item__details', 'container');
    innerElement.appendChild(detailsElement);
    let descriptionElement = document.createElement('div');
    descriptionElement.classList.add('picture-item__description', 'picture-item__title');
    detailsElement.appendChild(descriptionElement);
    let titleElement = document.createElement('b');
    let titleLink = document.createElement('a');
    titleLink.classList.add('picture-item__title');
    titleLink.setAttribute('rel', 'noopener');
    titleLink.textContent = json_data.clip_name;
    titleElement.appendChild(titleLink);
    descriptionElement.appendChild(titleElement);
    descriptionElement.appendChild(document.createElement('br'));
    descriptionElement.appendChild(document.createElement('hr'));
    let vocabElement = document.createElement('span');
    vocabElement.classList.add('vocab-display');
    //vocabElement.textContent = json_data.vocabulary.join(', ');
    descriptionElement.appendChild(vocabElement);
    let grammarElement = document.createElement('span');
    grammarElement.classList.add('grammar-display');
    grammarElement.textContent = json_data.grammar;
    descriptionElement.appendChild(grammarElement);
    let cultureElement = document.createElement('span');
    cultureElement.classList.add('culture-display');
    cultureElement.textContent = json_data.culture;
    descriptionElement.appendChild(cultureElement);
    //console.log(newElement);
    // re initialize shuffle
    this.shuffle = new Shuffle(this.element, {
      itemSelector: '.picture-item',
      sizer: this.element.querySelector('.my-sizer-element'),
    });
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

    if (btnGroup === 'Vocabulary') {
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
      
      function _sortByVocab(element) {
        return element.getAttribute('data-vocab');
      }

      let options = {};
      options = {
        reverse: false,
        by: _sortByVocab,
      };
      this.shuffle.sort(options);
    }

    if (btnGroup === 'Grammar') {
      // select all with class vocab-display
      let vocabDisplay = document.querySelectorAll('.vocab-display');
      // loop through each element and make it visible
      vocabDisplay.forEach((element) => {
        element.style.display = 'none';
      });
      // select all with class grammar-display
      let grammarDisplay = document.querySelectorAll('.grammar-display');
      // loop through each element and hide it
      grammarDisplay.forEach((element) => {
        element.style.display = 'block';
      });
      // select all with class culture-display
      let cultureDisplay = document.querySelectorAll('.culture-display');
      // loop through each element and hide it
      cultureDisplay.forEach((element) => {
        element.style.display = 'none';
      });
      
      function _sortByGrammar(element) {
        return element.getAttribute('data-grammar');
      }

      let options = {};
      options = {
        reverse: false,
        by: _sortByGrammar,
      };
      this.shuffle.sort(options);
    }

    if (btnGroup === 'Culture') {
      // select all with class vocab-display
      let vocabDisplay = document.querySelectorAll('.vocab-display');
      // loop through each element and make it visible
      vocabDisplay.forEach((element) => {
        element.style.display = 'none';
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
        element.style.display = 'block';
      });
      
      function _sortByCulture(element) {
        return element.getAttribute('data-culture');
      }

      let options = {};
      options = {
        reverse: false,
        by: _sortByCulture,
      };
      this.shuffle.sort(options);
    }

  }

  
  _removeActiveClassFromChildren(parent) {
    const { children } = parent;
    for (let i = children.length - 1; i >= 0; i--) {
      children[i].classList.remove('active');
    }
  }

  _watchScroll() {
    let grid = document.querySelector('#grid');
    var bounds = grid.getBoundingClientRect();
    // when the user scrolls to the bottom of the grid
    if (bounds.bottom < window.innerHeight) {
      this._pagination(this._gridSize);
    }
    
  }

  _pagination(maxItems) {
    
    // get value of how many items have isVisible = true
    // note: shuffle.visibleItems only changes on update
    let visibleItems = this.shuffle.items.filter((item) => item.isVisible).length;
    // if visibleItems is greater than maxItems
    if (visibleItems > maxItems) {
      // get the difference of visibleItems and maxItems
      let difference = visibleItems - maxItems;
      // loop through the shuffle items in reverse
      for (let i = this.shuffle.items.length - 1; i >= 0; i--) {
        // if the item is visible
        if (this.shuffle.items[i].isVisible) {
          // hide the item
          this.shuffle.items[i].hide();
          this.shuffle.items[i].wasHidden = true;
          // subtract 1 from difference
          difference--;
          // if difference is 0, break the loop
          if (difference === 0) {
            break;
          }
        }
      }
    } else {
      let count = 0;
      for (let i = 0; i < this.shuffle.items.length; i++) {
        if (this.shuffle.items[i].wasHidden) {
          if (count < (maxItems + 3)) {
            this.shuffle.items[i].show();
            this.shuffle.items[i].wasHidden = false;          
            count++;
          }
        }
      }
      
    }
    this.shuffle.update() 
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

      // also search in grammar-display, vocab-display, culture-display
      const grammarText = element.dataset.grammar.toLowerCase().trim();
      const vocabText = element.dataset.vocab.toLowerCase().trim();
      const cultureText = element.dataset.culture.toLowerCase().trim();
      const indexText = element.dataset.index.toLowerCase().trim();
      return titleText.indexOf(searchText) !== -1 || grammarText.indexOf(searchText) !== -1 || vocabText.indexOf(searchText) !== -1 || cultureText.indexOf(searchText) !== -1 || indexText.indexOf(searchText) !== -1;

      
    });
  }
}
document.addEventListener('scroll', () => {
  window.prima._watchScroll();
});

document.addEventListener('DOMContentLoaded', () => {
  window.prima = new Prima(document.getElementById('grid'));
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
