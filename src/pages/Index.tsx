import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Privilege {
  id: number;
  name: string;
  icon: string;
  requirement: number;
  color: string;
}

interface Achievement {
  amount: number;
  message: string;
}

const privileges: Privilege[] = [
  { id: 1, name: 'Бомж', icon: '🏚️', requirement: 0, color: 'text-gray-500' },
  { id: 2, name: 'Богач', icon: '💼', requirement: 50000, color: 'text-blue-400' },
  { id: 3, name: 'Миллионер', icon: '💎', requirement: 1000000, color: 'text-purple-400' },
  { id: 4, name: 'Миллиардер', icon: '👑', requirement: 1000000000, color: 'text-yellow-400' },
  { id: 5, name: 'Читер', icon: '⚡', requirement: 5000000000, color: 'text-red-400' },
  { id: 6, name: 'Хакер', icon: '💻', requirement: 10000000000, color: 'text-green-400' },
  { id: 7, name: 'Бог', icon: '✨', requirement: 100000000000, color: 'text-amber-400' },
];

const achievements: Achievement[] = [
  { amount: 100000, message: 'хорош!' },
  { amount: 1000000, message: 'мега харош!' },
  { amount: 2000000, message: 'А ТЫ КРУТОЙ!' },
  { amount: 5000000, message: 'Лучший!' },
  { amount: 10000000, message: 'ты топ!' },
  { amount: 20000000, message: 'Почти 21кк' },
  { amount: 25000000, message: 'теперь до 100кк.' },
  { amount: 100000000, message: 'ты прошол игру!' },
];

export default function Index() {
  const [balance, setBalance] = useState<number>(0);
  const [clickPower, setClickPower] = useState<number>(1);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [adminUserId, setAdminUserId] = useState<string>('');
  const [adminAmount, setAdminAmount] = useState<string>('');
  const [reachedAchievements, setReachedAchievements] = useState<Set<number>>(new Set());
  const { toast } = useToast();

  const currentPrivilege = privileges
    .slice()
    .reverse()
    .find((p) => balance >= p.requirement) || privileges[0];

  const nextPrivilege = privileges.find((p) => p.requirement > balance);

  const progressToNext = nextPrivilege
    ? ((balance - currentPrivilege.requirement) /
        (nextPrivilege.requirement - currentPrivilege.requirement)) *
      100
    : 100;

  useEffect(() => {
    achievements.forEach((achievement) => {
      if (balance >= achievement.amount && !reachedAchievements.has(achievement.amount)) {
        setReachedAchievements((prev) => new Set(prev).add(achievement.amount));
        toast({
          title: '🎉 Достижение разблокировано!',
          description: achievement.message,
          duration: 5000,
        });
      }
    });
  }, [balance, reachedAchievements, toast]);

  const handleClick = () => {
    setBalance((prev) => prev + clickPower);
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000000) return `${(num / 1000000000).toFixed(2)}B`;
    if (num >= 1000000) return `${(num / 1000000).toFixed(2)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(2)}K`;
    return num.toString();
  };

  const handleAdminGive = () => {
    const amount = parseFloat(adminAmount);
    if (!isNaN(amount) && adminUserId) {
      setBalance((prev) => prev + amount);
      toast({
        title: '✅ Монеты выданы',
        description: `Пользователю ${adminUserId} начислено ${formatNumber(amount)} монет`,
      });
      setAdminAmount('');
      setAdminUserId('');
    }
  };

  const handleAdminTake = () => {
    const amount = parseFloat(adminAmount);
    if (!isNaN(amount) && adminUserId) {
      setBalance((prev) => Math.max(0, prev - amount));
      toast({
        title: '✅ Монеты забраны',
        description: `У пользователя ${adminUserId} забрано ${formatNumber(amount)} монет`,
      });
      setAdminAmount('');
      setAdminUserId('');
    }
  };

  return (
    <div className="min-h-screen bg-[#1A1A1A] relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-900/20 via-transparent to-yellow-600/10" />
      
      <div className="absolute top-0 left-0 w-full h-1 gold-gradient" />

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-4xl">
        <header className="text-center mb-12 space-y-4">
          <h1 className="text-5xl md:text-6xl font-bold gold-text mb-2 tracking-tight">
            От бомжа до миллиардера
          </h1>
          <p className="text-gray-400 text-lg">
            Ты сможешь только тут стать крутым и богатым!
          </p>

          <div className="flex justify-center gap-4 mt-6">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="border-yellow-600/50 hover:border-yellow-500">
                  <Icon name="Settings" size={16} className="mr-2" />
                  Админ-панель
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-card border-yellow-600/30">
                <DialogHeader>
                  <DialogTitle className="gold-text">Админ-панель</DialogTitle>
                  <DialogDescription>Управление монетами и привилегиями</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="userId">ID пользователя</Label>
                    <Input
                      id="userId"
                      value={adminUserId}
                      onChange={(e) => setAdminUserId(e.target.value)}
                      placeholder="Введите ID"
                      className="bg-background/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="amount">Количество монет</Label>
                    <Input
                      id="amount"
                      type="number"
                      value={adminAmount}
                      onChange={(e) => setAdminAmount(e.target.value)}
                      placeholder="0"
                      className="bg-background/50"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={handleAdminGive}
                      className="flex-1 gold-gradient text-black font-semibold"
                    >
                      <Icon name="Plus" size={16} className="mr-2" />
                      Выдать
                    </Button>
                    <Button
                      onClick={handleAdminTake}
                      variant="destructive"
                      className="flex-1"
                    >
                      <Icon name="Minus" size={16} className="mr-2" />
                      Забрать
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </header>

        <Card className="bg-gradient-to-br from-gray-900 to-black border-2 border-yellow-600/50 p-8 mb-8 shine-effect">
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center gap-4">
              <span className="text-6xl">{currentPrivilege.icon}</span>
              <div>
                <Badge className={`${currentPrivilege.color} text-lg px-4 py-1 bg-black/50`}>
                  {currentPrivilege.name}
                </Badge>
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-5xl font-bold gold-text">{formatNumber(balance)}</h2>
              <p className="text-gray-400">монет</p>
            </div>

            {nextPrivilege && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-400">
                  <span>До {nextPrivilege.name}</span>
                  <span>{formatNumber(nextPrivilege.requirement - balance)} осталось</span>
                </div>
                <Progress value={progressToNext} className="h-3 bg-gray-800" />
              </div>
            )}

            <Button
              size="lg"
              onClick={handleClick}
              className="w-full h-20 text-2xl font-bold gold-gradient text-black hover:scale-105 transition-transform"
            >
              <Icon name="DollarSign" size={32} className="mr-2" />
              Заработать +{clickPower}
            </Button>
          </div>
        </Card>

        <Tabs defaultValue="privileges" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-gray-900/50 border border-yellow-600/30">
            <TabsTrigger value="privileges" className="data-[state=active]:gold-gradient data-[state=active]:text-black">
              <Icon name="Award" size={18} className="mr-2" />
              Привилегии
            </TabsTrigger>
            <TabsTrigger value="achievements" className="data-[state=active]:gold-gradient data-[state=active]:text-black">
              <Icon name="Trophy" size={18} className="mr-2" />
              Достижения
            </TabsTrigger>
          </TabsList>

          <TabsContent value="privileges" className="space-y-3 mt-6">
            {privileges.map((privilege) => {
              const isUnlocked = balance >= privilege.requirement;
              return (
                <Card
                  key={privilege.id}
                  className={`p-4 border-2 transition-all ${
                    isUnlocked
                      ? 'bg-gradient-to-r from-yellow-900/30 to-transparent border-yellow-600/50'
                      : 'bg-gray-900/30 border-gray-700/30'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="text-4xl">{privilege.icon}</span>
                      <div>
                        <h3 className={`text-xl font-bold ${privilege.color}`}>
                          {privilege.name}
                        </h3>
                        <p className="text-sm text-gray-400">
                          {formatNumber(privilege.requirement)} монет
                        </p>
                      </div>
                    </div>
                    {isUnlocked && (
                      <Icon name="CheckCircle" size={24} className="text-yellow-500" />
                    )}
                  </div>
                </Card>
              );
            })}
          </TabsContent>

          <TabsContent value="achievements" className="space-y-3 mt-6">
            {achievements.map((achievement, index) => {
              const isUnlocked = reachedAchievements.has(achievement.amount);
              return (
                <Card
                  key={index}
                  className={`p-4 border-2 transition-all ${
                    isUnlocked
                      ? 'bg-gradient-to-r from-green-900/30 to-transparent border-green-600/50'
                      : 'bg-gray-900/30 border-gray-700/30'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">
                        {formatNumber(achievement.amount)} монет
                      </h3>
                      <p className="text-gray-400 text-sm">{achievement.message}</p>
                    </div>
                    {isUnlocked ? (
                      <Icon name="Star" size={24} className="text-yellow-500 fill-yellow-500" />
                    ) : (
                      <Icon name="Lock" size={24} className="text-gray-600" />
                    )}
                  </div>
                </Card>
              );
            })}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
