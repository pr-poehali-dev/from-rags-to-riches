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

interface PassiveUpgrade {
  id: number;
  name: string;
  icon: string;
  cost: number;
  income: number;
  description: string;
}

const privileges: Privilege[] = [
  { id: 1, name: 'Новичок', icon: '🎯', requirement: 0, color: 'text-gray-400' },
  { id: 2, name: 'Боец', icon: '⚔️', requirement: 50000, color: 'text-blue-400' },
  { id: 3, name: 'Элита', icon: '🎖️', requirement: 1000000, color: 'text-purple-400' },
  { id: 4, name: 'Легенда', icon: '👑', requirement: 1000000000, color: 'text-yellow-400' },
  { id: 5, name: 'Мастер', icon: '⚡', requirement: 5000000000, color: 'text-red-400' },
  { id: 6, name: 'Генерал', icon: '🔱', requirement: 10000000000, color: 'text-cyan-400' },
  { id: 7, name: 'Бессмертный', icon: '✨', requirement: 100000000000, color: 'text-amber-400' },
];

const achievements: Achievement[] = [
  { amount: 100000, message: 'Первая кровь!' },
  { amount: 1000000, message: 'Миллионер!' },
  { amount: 2000000, message: 'Неостановимый!' },
  { amount: 5000000, message: 'Убийственная серия!' },
  { amount: 10000000, message: 'Легендарная серия!' },
  { amount: 20000000, message: 'Доминирование!' },
  { amount: 25000000, message: 'Безумие!' },
  { amount: 100000000, message: 'Годмод!' },
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
  const [cooldown, setCooldown] = useState<number>(0);
  const { toast } = useToast();

  useEffect(() => {
    const interval = setInterval(() => {
      if (passiveIncome > 0) {
        setBalance((prev) => prev + passiveIncome);
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [passiveIncome]);

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

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
          title: '🎯 ДОСТИЖЕНИЕ РАЗБЛОКИРОВАНО!',
          description: achievement.message,
          duration: 5000,
        });
      }
    });
  }, [balance, reachedAchievements, toast]);

  const handleClick = () => {
    if (cooldown > 0) return;
    
    const randomAmount = Math.floor(Math.random() * 5000) + 1;
    const totalAmount = randomAmount * clickMultiplier;
    setBalance((prev) => prev + totalAmount);
    setCooldown(2);
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
        title: '✅ Кредиты выданы',
        description: `Игроку ${adminUserId} начислено ${formatNumber(amount)} кредитов`,
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
        title: '✅ Кредиты забраны',
        description: `У игрока ${adminUserId} забрано ${formatNumber(amount)} кредитов`,
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
        title: '✅ Доступ получен',
        description: 'Добро пожаловать, Администратор!',
      });
    } else {
      toast({
        title: '❌ Доступ запрещён',
        description: 'Неверный логин или пароль',
        variant: 'destructive',
      });
    }
  };

  const upgrades: Upgrade[] = [
    { id: 1, name: 'Двойной урон', icon: '⚡', cost: 5000, multiplier: 2, description: 'x2 к заработку' },
    { id: 2, name: 'Тройной выстрел', icon: '🎯', cost: 25000, multiplier: 3, description: 'x3 к заработку' },
    { id: 3, name: 'Взрывной урон', icon: '💥', cost: 100000, multiplier: 5, description: 'x5 к заработку' },
    { id: 4, name: 'Критический удар', icon: '⚔️', cost: 500000, multiplier: 10, description: 'x10 к заработку' },
    { id: 5, name: 'Божественный урон', icon: '🔱', cost: 5000000, multiplier: 25, description: 'x25 к заработку' },
  ];

  const passiveUpgrades: PassiveUpgrade[] = [
    { id: 101, name: 'Автострелок', icon: '🤖', cost: 10000, income: 100, description: '+100 / 2 сек' },
    { id: 102, name: 'Турель', icon: '🔫', cost: 50000, income: 500, description: '+500 / 2 сек' },
    { id: 103, name: 'Вертолёт', icon: '🚁', cost: 250000, income: 2500, description: '+2.5K / 2 сек' },
    { id: 104, name: 'Танк', icon: '🔥', cost: 1000000, income: 10000, description: '+10K / 2 сек' },
    { id: 105, name: 'Ядерная бомба', icon: '☢️', cost: 10000000, income: 100000, description: '+100K / 2 сек' },
  ];

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

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/20 via-background to-background" />
      
      <div className="absolute top-0 left-0 w-full h-1 cyber-gradient" />

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-4xl">
        <header className="text-center mb-12 space-y-4">
          <h1 className="text-5xl md:text-6xl font-bold cyber-text mb-2 tracking-tight uppercase">
            От бомжа до миллиардера
          </h1>
          <p className="text-cyan-400 text-lg uppercase tracking-wider font-semibold">
            // Тактический кликер //
          </p>

          <div className="flex justify-center gap-4 mt-6">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="border-cyan-600/50 hover:border-cyan-400 uppercase">
                  <Icon name="Shield" size={16} className="mr-2" />
                  Админ
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-card border-cyan-600/30 tactical-card">
                <DialogHeader>
                  <DialogTitle className="cyber-text uppercase">Панель управления</DialogTitle>
                  <DialogDescription className="text-cyan-400">
                    {showAdminLogin ? 'Авторизация требуется' : 'Управление игровой экономикой'}
                  </DialogDescription>
                </DialogHeader>
                {showAdminLogin ? (
                  <div className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="adminLogin" className="text-cyan-400 uppercase text-xs">Логин</Label>
                      <Input
                        id="adminLogin"
                        value={adminLogin}
                        onChange={(e) => setAdminLogin(e.target.value)}
                        placeholder="Введите логин"
                        className="bg-background/50 border-cyan-600/30"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="adminPassword" className="text-cyan-400 uppercase text-xs">Пароль</Label>
                      <Input
                        id="adminPassword"
                        type="password"
                        value={adminPassword}
                        onChange={(e) => setAdminPassword(e.target.value)}
                        placeholder="Введите пароль"
                        className="bg-background/50 border-cyan-600/30"
                      />
                    </div>
                    <Button
                      onClick={handleAdminLogin}
                      className="w-full cyber-gradient text-black font-semibold uppercase"
                    >
                      <Icon name="LogIn" size={16} className="mr-2" />
                      Войти
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="userId" className="text-cyan-400 uppercase text-xs">ID игрока</Label>
                      <Input
                        id="userId"
                        value={adminUserId}
                        onChange={(e) => setAdminUserId(e.target.value)}
                        placeholder="Введите ID"
                        className="bg-background/50 border-cyan-600/30"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="amount" className="text-cyan-400 uppercase text-xs">Количество</Label>
                      <Input
                        id="amount"
                        type="number"
                        value={adminAmount}
                        onChange={(e) => setAdminAmount(e.target.value)}
                        placeholder="0"
                        className="bg-background/50 border-cyan-600/30"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={handleAdminGive}
                        className="flex-1 cyber-gradient text-black font-semibold uppercase"
                      >
                        <Icon name="Plus" size={16} className="mr-2" />
                        Выдать
                      </Button>
                      <Button
                        onClick={handleAdminTake}
                        variant="destructive"
                        className="flex-1 uppercase"
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

        <Card className="tactical-card p-8 mb-8 shine-effect pulse-glow">
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center gap-4">
              <span className="text-6xl">{currentPrivilege.icon}</span>
              <div>
                <Badge className={`${currentPrivilege.color} text-lg px-4 py-1 bg-black/50 uppercase font-bold border-2 border-current`}>
                  {currentPrivilege.name}
                </Badge>
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-5xl font-bold cyber-text">{formatNumber(balance)}</h2>
              <p className="text-cyan-400 uppercase text-sm tracking-widest">Кредиты</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {clickMultiplier > 1 && (
                  <Badge className="bg-orange-600/30 text-orange-400 border-orange-500/50 uppercase font-semibold">
                    Урон: x{clickMultiplier}
                  </Badge>
                )}
                {passiveIncome > 0 && (
                  <Badge className="bg-cyan-600/30 text-cyan-400 border-cyan-500/50 uppercase font-semibold">
                    +{formatNumber(passiveIncome)} / 2s
                  </Badge>
                )}
              </div>
            </div>

            {nextPrivilege && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-cyan-400 uppercase">
                  <span>Следующий ранг: {nextPrivilege.name}</span>
                  <span>{formatNumber(nextPrivilege.requirement - balance)}</span>
                </div>
                <Progress value={progressToNext} className="h-3 bg-gray-800 [&>div]:bg-gradient-to-r [&>div]:from-cyan-500 [&>div]:to-cyan-300" />
              </div>
            )}

            <Button
              size="lg"
              onClick={handleClick}
              disabled={cooldown > 0}
              className={`w-full h-20 text-2xl font-bold uppercase tracking-wider transition-all ${
                cooldown > 0 
                  ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
                  : 'cyber-gradient text-black hover:scale-105'
              }`}
            >
              {cooldown > 0 ? (
                <>
                  <Icon name="Clock" size={32} className="mr-2" />
                  Перезарядка {cooldown}s
                </>
              ) : (
                <>
                  <Icon name="Crosshair" size={32} className="mr-2" />
                  Атаковать
                </>
              )}
            </Button>
          </div>
        </Card>

        <Tabs defaultValue="privileges" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-gray-900/50 border border-cyan-600/30">
            <TabsTrigger value="privileges" className="data-[state=active]:cyber-gradient data-[state=active]:text-black text-xs md:text-sm uppercase font-semibold">
              <Icon name="Award" size={16} className="mr-1" />
              Ранги
            </TabsTrigger>
            <TabsTrigger value="upgrades" className="data-[state=active]:cyber-gradient data-[state=active]:text-black text-xs md:text-sm uppercase font-semibold">
              <Icon name="Zap" size={16} className="mr-1" />
              Урон
            </TabsTrigger>
            <TabsTrigger value="passive" className="data-[state=active]:cyber-gradient data-[state=active]:text-black text-xs md:text-sm uppercase font-semibold">
              <Icon name="TrendingUp" size={16} className="mr-1" />
              Авто
            </TabsTrigger>
            <TabsTrigger value="achievements" className="data-[state=active]:cyber-gradient data-[state=active]:text-black text-xs md:text-sm uppercase font-semibold">
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
                      ? 'tactical-card'
                      : 'bg-gray-900/30 border-gray-700/30'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="text-4xl">{privilege.icon}</span>
                      <div>
                        <h3 className={`text-xl font-bold ${privilege.color} uppercase`}>
                          {privilege.name}
                        </h3>
                        <p className="text-sm text-gray-400">
                          {formatNumber(privilege.requirement)} кредитов
                        </p>
                      </div>
                    </div>
                    {isUnlocked && (
                      <Icon name="CheckCircle" size={24} className="text-cyan-500" />
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
                      ? 'tactical-card'
                      : 'bg-gray-900/30 border-gray-700/30'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="text-4xl">{upgrade.icon}</span>
                      <div>
                        <h3 className="text-xl font-bold text-orange-400 uppercase">
                          {upgrade.name}
                        </h3>
                        <p className="text-sm text-gray-400">{upgrade.description}</p>
                        <p className="text-sm text-cyan-400 font-semibold mt-1">
                          {formatNumber(upgrade.cost)} кредитов
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
                        className={canAfford ? 'cyber-gradient text-black font-semibold uppercase' : 'uppercase'}
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
                      ? 'tactical-card'
                      : 'bg-gray-900/30 border-gray-700/30'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="text-4xl">{upgrade.icon}</span>
                      <div>
                        <h3 className="text-xl font-bold text-cyan-400 uppercase">
                          {upgrade.name}
                        </h3>
                        <p className="text-sm text-gray-400">{upgrade.description}</p>
                        <p className="text-sm text-cyan-400 font-semibold mt-1">
                          {formatNumber(upgrade.cost)} кредитов
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
                        className={canAfford ? 'cyber-gradient text-black font-semibold uppercase' : 'uppercase'}
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
                      ? 'tactical-card'
                      : 'bg-gray-900/30 border-gray-700/30'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-cyan-400 uppercase">
                        {formatNumber(achievement.amount)} кредитов
                      </h3>
                      <p className="text-gray-400 text-sm font-semibold">{achievement.message}</p>
                    </div>
                    {isUnlocked ? (
                      <Icon name="Star" size={24} className="text-cyan-500 fill-cyan-500" />
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
