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

interface Upgrade {
  id: number;
  name: string;
  icon: string;
  cost: number;
  multiplier: number;
  description: string;
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
  const [clickMultiplier, setClickMultiplier] = useState<number>(1);
  const [passiveIncome, setPassiveIncome] = useState<number>(0);
  const [purchasedUpgrades, setPurchasedUpgrades] = useState<Set<number>>(new Set());
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [adminUserId, setAdminUserId] = useState<string>('');
  const [adminAmount, setAdminAmount] = useState<string>('');
  const [adminLogin, setAdminLogin] = useState<string>('');
  const [adminPassword, setAdminPassword] = useState<string>('');
  const [showAdminLogin, setShowAdminLogin] = useState<boolean>(true);
  const [reachedAchievements, setReachedAchievements] = useState<Set<number>>(new Set());
  const { toast } = useToast();

  useEffect(() => {
    const interval = setInterval(() => {
      if (passiveIncome > 0) {
        setBalance((prev) => prev + passiveIncome);
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [passiveIncome]);

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
    const randomAmount = Math.floor(Math.random() * 5000) + 1;
    const totalAmount = randomAmount * clickMultiplier;
    setBalance((prev) => prev + totalAmount);
  };

  const upgrades: Upgrade[] = [
    { id: 1, name: 'Удвоитель', icon: '⚡', cost: 5000, multiplier: 2, description: 'Удваивает заработок' },
    { id: 2, name: 'Турбо', icon: '🚀', cost: 25000, multiplier: 3, description: 'Утраивает заработок' },
    { id: 3, name: 'Мега-буст', icon: '💎', cost: 100000, multiplier: 5, description: 'x5 к заработку' },
    { id: 4, name: 'Ультра-сила', icon: '⭐', cost: 500000, multiplier: 10, description: 'x10 к заработку' },
    { id: 5, name: 'Божественный', icon: '👑', cost: 5000000, multiplier: 25, description: 'x25 к заработку' },
  ];

  interface PassiveUpgrade {
    id: number;
    name: string;
    icon: string;
    cost: number;
    income: number;
    description: string;
  }

  const passiveUpgrades: PassiveUpgrade[] = [
    { id: 101, name: 'Автокликер', icon: '🤖', cost: 10000, income: 100, description: '+100 монет / 2 сек' },
    { id: 102, name: 'Бизнес', icon: '💼', cost: 50000, income: 500, description: '+500 монет / 2 сек' },
    { id: 103, name: 'Фабрика', icon: '🏭', cost: 250000, income: 2500, description: '+2.5K монет / 2 сек' },
    { id: 104, name: 'Корпорация', icon: '🏢', cost: 1000000, income: 10000, description: '+10K монет / 2 сек' },
    { id: 105, name: 'Империя', icon: '🌍', cost: 10000000, income: 100000, description: '+100K монет / 2 сек' },
  ];

  const handleBuyPassiveUpgrade = (upgrade: PassiveUpgrade) => {
    if (balance >= upgrade.cost && !purchasedUpgrades.has(upgrade.id)) {
      setBalance((prev) => prev - upgrade.cost);
      setPassiveIncome((prev) => prev + upgrade.income);
      setPurchasedUpgrades((prev) => new Set(prev).add(upgrade.id));
      toast({
        title: '✅ Улучшение куплено!',
        description: `${upgrade.name}: ${upgrade.description}`,
      });
    }
  };

  const handleBuyUpgrade = (upgrade: Upgrade) => {
    if (balance >= upgrade.cost && !purchasedUpgrades.has(upgrade.id)) {
      setBalance((prev) => prev - upgrade.cost);
      setClickMultiplier((prev) => prev * upgrade.multiplier);
      setPurchasedUpgrades((prev) => new Set(prev).add(upgrade.id));
      toast({
        title: '✅ Улучшение куплено!',
        description: `${upgrade.name}: ${upgrade.description}`,
      });
    }
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

  const handleAdminLogin = () => {
    if (adminLogin === 'KosmoCat' && adminPassword === 'KosmoCat') {
      setIsAdmin(true);
      setShowAdminLogin(false);
      toast({
        title: '✅ Вход выполнен',
        description: 'Добро пожаловать, администратор!',
      });
    } else {
      toast({
        title: '❌ Ошибка входа',
        description: 'Неверный логин или пароль',
        variant: 'destructive',
      });
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
                  <DialogDescription>
                    {showAdminLogin ? 'Введите данные для входа' : 'Управление монетами и привилегиями'}
                  </DialogDescription>
                </DialogHeader>
                {showAdminLogin ? (
                  <div className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="adminLogin">Логин</Label>
                      <Input
                        id="adminLogin"
                        value={adminLogin}
                        onChange={(e) => setAdminLogin(e.target.value)}
                        placeholder="Введите логин"
                        className="bg-background/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="adminPassword">Пароль</Label>
                      <Input
                        id="adminPassword"
                        type="password"
                        value={adminPassword}
                        onChange={(e) => setAdminPassword(e.target.value)}
                        placeholder="Введите пароль"
                        className="bg-background/50"
                      />
                    </div>
                    <Button
                      onClick={handleAdminLogin}
                      className="w-full gold-gradient text-black font-semibold"
                    >
                      <Icon name="LogIn" size={16} className="mr-2" />
                      Войти
                    </Button>
                  </div>
                ) : (
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
                )}
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
              <div className="flex flex-wrap gap-2 justify-center">
                {clickMultiplier > 1 && (
                  <Badge className="bg-yellow-600/30 text-yellow-400 border-yellow-500/50">
                    Множитель: x{clickMultiplier}
                  </Badge>
                )}
                {passiveIncome > 0 && (
                  <Badge className="bg-green-600/30 text-green-400 border-green-500/50">
                    +{formatNumber(passiveIncome)} / 2 сек
                  </Badge>
                )}
              </div>
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
              Заработать 💰
            </Button>
          </div>
        </Card>

        <Tabs defaultValue="privileges" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-gray-900/50 border border-yellow-600/30">
            <TabsTrigger value="privileges" className="data-[state=active]:gold-gradient data-[state=active]:text-black text-xs md:text-sm">
              <Icon name="Award" size={16} className="mr-1" />
              Привилегии
            </TabsTrigger>
            <TabsTrigger value="upgrades" className="data-[state=active]:gold-gradient data-[state=active]:text-black text-xs md:text-sm">
              <Icon name="Zap" size={16} className="mr-1" />
              Клики
            </TabsTrigger>
            <TabsTrigger value="passive" className="data-[state=active]:gold-gradient data-[state=active]:text-black text-xs md:text-sm">
              <Icon name="TrendingUp" size={16} className="mr-1" />
              Доход
            </TabsTrigger>
            <TabsTrigger value="achievements" className="data-[state=active]:gold-gradient data-[state=active]:text-black text-xs md:text-sm">
              <Icon name="Trophy" size={16} className="mr-1" />
              Награды
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

          <TabsContent value="upgrades" className="space-y-3 mt-6">
            {upgrades.map((upgrade) => {
              const isPurchased = purchasedUpgrades.has(upgrade.id);
              const canAfford = balance >= upgrade.cost;
              return (
                <Card
                  key={upgrade.id}
                  className={`p-4 border-2 transition-all ${
                    isPurchased
                      ? 'bg-gradient-to-r from-green-900/30 to-transparent border-green-600/50'
                      : canAfford
                      ? 'bg-gradient-to-r from-yellow-900/30 to-transparent border-yellow-600/50'
                      : 'bg-gray-900/30 border-gray-700/30'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="text-4xl">{upgrade.icon}</span>
                      <div>
                        <h3 className="text-xl font-bold text-yellow-400">
                          {upgrade.name}
                        </h3>
                        <p className="text-sm text-gray-400">{upgrade.description}</p>
                        <p className="text-sm text-yellow-500 font-semibold mt-1">
                          {formatNumber(upgrade.cost)} монет
                        </p>
                      </div>
                    </div>
                    {isPurchased ? (
                      <Icon name="CheckCircle" size={24} className="text-green-500" />
                    ) : (
                      <Button
                        onClick={() => handleBuyUpgrade(upgrade)}
                        disabled={!canAfford}
                        size="sm"
                        className={canAfford ? 'gold-gradient text-black font-semibold' : ''}
                      >
                        Купить
                      </Button>
                    )}
                  </div>
                </Card>
              );
            })}
          </TabsContent>

          <TabsContent value="passive" className="space-y-3 mt-6">
            {passiveUpgrades.map((upgrade) => {
              const isPurchased = purchasedUpgrades.has(upgrade.id);
              const canAfford = balance >= upgrade.cost;
              return (
                <Card
                  key={upgrade.id}
                  className={`p-4 border-2 transition-all ${
                    isPurchased
                      ? 'bg-gradient-to-r from-green-900/30 to-transparent border-green-600/50'
                      : canAfford
                      ? 'bg-gradient-to-r from-yellow-900/30 to-transparent border-yellow-600/50'
                      : 'bg-gray-900/30 border-gray-700/30'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="text-4xl">{upgrade.icon}</span>
                      <div>
                        <h3 className="text-xl font-bold text-green-400">
                          {upgrade.name}
                        </h3>
                        <p className="text-sm text-gray-400">{upgrade.description}</p>
                        <p className="text-sm text-yellow-500 font-semibold mt-1">
                          {formatNumber(upgrade.cost)} монет
                        </p>
                      </div>
                    </div>
                    {isPurchased ? (
                      <Icon name="CheckCircle" size={24} className="text-green-500" />
                    ) : (
                      <Button
                        onClick={() => handleBuyPassiveUpgrade(upgrade)}
                        disabled={!canAfford}
                        size="sm"
                        className={canAfford ? 'gold-gradient text-black font-semibold' : ''}
                      >
                        Купить
                      </Button>
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