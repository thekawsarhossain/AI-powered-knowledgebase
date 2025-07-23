'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Link from 'next/link';
import { LogOut, User, BookOpen, PlusCircle } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { usePathname } from 'next/navigation';

export function Header() {
    const pathname = usePathname();
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
    };

    const getUserInitials = (email: string) => {
        return email.substring(0, 2).toUpperCase();
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                <Link href="/dashboard" className="flex items-center space-x-2">
                    <BookOpen className="h-6 w-6 text-primary" />
                    <span className="text-xl font-bold text-foreground">
                        Knowledge Base
                    </span>
                </Link>

                {user && (
                    <div className="flex items-center gap-4">
                        {pathname !== '/dashboard/articles/new' && <Link href="/dashboard/articles/new">
                            <Button variant="outline" size="sm" className="hidden sm:flex">
                                <PlusCircle className="h-4 w-4 mr-2" />
                                New Article
                            </Button>
                        </Link>}

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                                    <Avatar className="h-8 w-8">
                                        <AvatarFallback>
                                            {getUserInitials(user.email)}
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end" forceMount>
                                <DropdownMenuLabel className="font-normal">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium leading-none">Account</p>
                                        <p className="text-xs leading-none text-muted-foreground">
                                            {user.email}
                                        </p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link href="/dashboard" className="flex items-center">
                                        <User className="mr-2 h-4 w-4" />
                                        <span>Dashboard</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild className="sm:hidden">
                                    <Link href="/dashboard/articles/new" className="flex items-center">
                                        <PlusCircle className="mr-2 h-4 w-4" />
                                        <span>New Article</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Log out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                )}
            </div>
        </header>
    );
}
