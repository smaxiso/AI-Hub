// App state reducer for better state management

export const initialState = {
  searchQuery: '',
  selectedCategory: 'All',
  filters: {
    pricing: 'All',
    sortBy: 'name',
    tags: []
  },
  ui: {
    activeTab: 0,
    modalOpen: false,
    showShortcuts: false,
    comparisonOpen: false
  },
  selectedTool: null,
  comparisonTools: [],
  collectionFilter: null
};

export function appReducer(state, action) {
  switch (action.type) {
    case 'SET_SEARCH':
      return {
        ...state,
        searchQuery: action.payload
      };

    case 'SET_CATEGORY':
      return {
        ...state,
        selectedCategory: action.payload
      };

    case 'SET_PRICING_FILTER':
      return {
        ...state,
        filters: {
          ...state.filters,
          pricing: action.payload
        }
      };

    case 'SET_SORT_BY':
      return {
        ...state,
        filters: {
          ...state.filters,
          sortBy: action.payload
        }
      };

    case 'SET_TAGS':
      return {
        ...state,
        filters: {
          ...state.filters,
          tags: action.payload
        }
      };

    case 'SET_ACTIVE_TAB':
      return {
        ...state,
        ui: {
          ...state.ui,
          activeTab: action.payload
        },
        collectionFilter: null // Reset collection filter when switching tabs
      };

    case 'OPEN_MODAL':
      return {
        ...state,
        ui: {
          ...state.ui,
          modalOpen: true
        },
        selectedTool: action.payload
      };

    case 'CLOSE_MODAL':
      return {
        ...state,
        ui: {
          ...state.ui,
          modalOpen: false
        },
        selectedTool: null
      };

    case 'TOGGLE_SHORTCUTS':
      return {
        ...state,
        ui: {
          ...state.ui,
          showShortcuts: !state.ui.showShortcuts
        }
      };

    case 'OPEN_COMPARISON':
      return {
        ...state,
        ui: {
          ...state.ui,
          comparisonOpen: true
        },
        comparisonTools: action.payload
      };

    case 'CLOSE_COMPARISON':
      return {
        ...state,
        ui: {
          ...state.ui,
          comparisonOpen: false
        },
        comparisonTools: []
      };

    case 'SET_COLLECTION_FILTER':
      return {
        ...state,
        collectionFilter: action.payload
      };

    case 'RESET_FILTERS':
      return {
        ...state,
        searchQuery: '',
        selectedCategory: 'All',
        filters: {
          pricing: 'All',
          sortBy: 'name',
          tags: []
        },
        collectionFilter: null
      };

    default:
      return state;
  }
}

