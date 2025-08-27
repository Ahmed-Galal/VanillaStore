import { createContext, useContext, useReducer, useCallback } from 'react';
import { Product } from '@/lib/products';

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

type CartAction =
  | { type: 'ADD_ITEM'; product: Product }
  | { type: 'REMOVE_ITEM'; productId: string }
  | { type: 'UPDATE_QUANTITY'; productId: string; quantity: number }
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_CART' }
  | { type: 'SET_CART_OPEN'; isOpen: boolean };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find(item => item.product.id === action.product.id);
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.product.id === action.product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        };
      }
      return {
        ...state,
        items: [...state.items, { product: action.product, quantity: 1 }]
      };
    }
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.product.id !== action.productId)
      };
    case 'UPDATE_QUANTITY':
      if (action.quantity <= 0) {
        return {
          ...state,
          items: state.items.filter(item => item.product.id !== action.productId)
        };
      }
      return {
        ...state,
        items: state.items.map(item =>
          item.product.id === action.productId
            ? { ...item, quantity: action.quantity }
            : item
        )
      };
    case 'CLEAR_CART':
      return {
        ...state,
        items: []
      };
    case 'TOGGLE_CART':
      return {
        ...state,
        isOpen: !state.isOpen
      };
    case 'SET_CART_OPEN':
      return {
        ...state,
        isOpen: action.isOpen
      };
    default:
      return state;
  }
}

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  setCartOpen: (isOpen: boolean) => void;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    isOpen: false
  });

  const addItem = useCallback((product: Product) => {
    dispatch({ type: 'ADD_ITEM', product });
  }, []);

  const removeItem = useCallback((productId: string) => {
    dispatch({ type: 'REMOVE_ITEM', productId });
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', productId, quantity });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR_CART' });
  }, []);

  const toggleCart = useCallback(() => {
    dispatch({ type: 'TOGGLE_CART' });
  }, []);

  const setCartOpen = useCallback((isOpen: boolean) => {
    dispatch({ type: 'SET_CART_OPEN', isOpen });
  }, []);

  const total = state.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      items: state.items,
      isOpen: state.isOpen,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      toggleCart,
      setCartOpen,
      total,
      itemCount
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
