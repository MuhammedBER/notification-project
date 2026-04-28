import React from 'react';
import { useNotifications } from './NotificationProvider';
import { Bell, Info, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { cn } from '../lib/utils';

const IconMap = {
    INFO: <Info className="w-4 h-4 text-blue-500" />,
    WARNING: <AlertTriangle className="w-4 h-4 text-amber-500" />,
    SUCCESS: <CheckCircle className="w-4 h-4 text-green-500" />,
    ERROR: <XCircle className="w-4 h-4 text-red-500" />
};

export const NotificationList = () => {
    const { notifications, isConnected } = useNotifications();

    return (
        <Card className="w-full h-full flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b">
                <div className="flex items-center gap-2">
                    <Bell className="w-5 h-5 text-primary" />
                    <CardTitle className="text-xl">Activity Feed</CardTitle>
                </div>
                <div className={cn(
                    "px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors",
                    isConnected ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700 animate-pulse"
                )}>
                    {isConnected ? 'Live' : 'Disconnected'}
                </div>
            </CardHeader>
            
            <CardContent className="flex-1 overflow-y-auto p-0">
                {notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-48 text-muted-foreground gap-2">
                        <Bell className="w-8 h-8 opacity-20" />
                        <p className="text-sm">No recent activity to show.</p>
                    </div>
                ) : (
                    <div className="divide-y">
                        {notifications.map((notif, idx) => (
                            <div key={notif.id || idx} className="p-4 hover:bg-muted/30 transition-colors flex gap-4">
                                <div className="mt-1">
                                    {IconMap[notif.type] || IconMap['INFO']}
                                </div>
                                <div className="flex-1 space-y-1">
                                    <div className="flex items-center justify-between gap-2">
                                        <h4 className="text-sm font-semibold leading-none">{notif.title}</h4>
                                        <span className="text-[10px] text-muted-foreground font-mono">
                                            {new Date(notif.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                        </span>
                                    </div>
                                    <p className="text-sm text-muted-foreground line-clamp-2">{notif.message}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
