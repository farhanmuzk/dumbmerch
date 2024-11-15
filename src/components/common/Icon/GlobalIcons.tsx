// GlobalIcons.tsx
import { Github, Search, Youtube, ChevronDown, ShoppingCart, Heart, Grid2x2, Grip, Bookmark, UserRoundPen, LogOut, Minus, Plus, Eye, Trash, Pencil, SmilePlus, ImagePlus, SendHorizontal, ImageOff, ChevronLeft, X, EllipsisVertical, Truck, ChevronRight, ListCollapse, WalletMinimal, Package, Users } from 'lucide-react';
import React from 'react';

export const GlobalIcons = {
    Search: (props: React.SVGProps<SVGSVGElement>) => <Search {...props} />,
    Github: (props: React.SVGProps<SVGSVGElement>) => (<Github {...props} />),
    Youtube: (props: React.SVGProps<SVGSVGElement>) => (<Youtube{...props} />),
    ChevronDown : (props: React.SVGProps<SVGSVGElement>) => (<ChevronDown{...props} />),
    ShoppingCart : (props: React.SVGProps<SVGSVGElement>) => (<ShoppingCart{...props} />),
    Like : (props: React.SVGProps<SVGSVGElement>) => (<Heart{...props} />),
    Grid2X2 : (props: React.SVGProps<SVGSVGElement>) => (<Grid2x2{...props} />),
    Grid4X4 : (props: React.SVGProps<SVGSVGElement>) => (<Grip{...props} />),
    Save : (props: React.SVGProps<SVGSVGElement>) => (<Bookmark{...props} />),
    Profile : (props: React.SVGProps<SVGSVGElement>) => (<UserRoundPen{...props} />),
    Logout : (props: React.SVGProps<SVGSVGElement>) => (<LogOut{...props} />),
    Minus : (props: React.SVGProps<SVGSVGElement>) => (<Minus{...props} />),
    Plus : (props: React.SVGProps<SVGSVGElement>) => (<Plus{...props} />),
    Eye : (props: React.SVGProps<SVGSVGElement>) => (<Eye{...props} />),
    Trash : (props: React.SVGProps<SVGSVGElement>) => (<Trash{...props} />),
    Edit : (props: React.SVGProps<SVGSVGElement>) => (<Pencil{...props} />),
    SmilePlus : (props: React.SVGProps<SVGSVGElement>) => (<SmilePlus{...props} />),
    ImagePlus : (props: React.SVGProps<SVGSVGElement>) => (<ImagePlus{...props} />),
    Send : (props: React.SVGProps<SVGSVGElement>) => (<SendHorizontal{...props} />),
    ImageOff : (props: React.SVGProps<SVGSVGElement>) => (<ImageOff{...props} />),
    ChevronLeft : (props: React.SVGProps<SVGSVGElement>) => (<ChevronLeft{...props} />),
    Remove: (props: React.SVGProps<SVGSVGElement>) => (<X{...props} />),
    ElipsVertical: (props: React.SVGProps<SVGSVGElement>) => (<EllipsisVertical{...props} />),
    ar: (props: React.SVGProps<SVGSVGElement>) => (<Truck{...props} />),
    ChevronRight : (props: React.SVGProps<SVGSVGElement>) => (<ChevronRight{...props} />),
    DetailList : (props: React.SVGProps<SVGSVGElement>) => (<ListCollapse{...props} />),
    Wallet : (props: React.SVGProps<SVGSVGElement>) => (<WalletMinimal{...props} />),
    Package : (props: React.SVGProps<SVGSVGElement>) => (<Package{...props} />),
    Users : (props: React.SVGProps<SVGSVGElement>) => (<Users{...props} />),

};
