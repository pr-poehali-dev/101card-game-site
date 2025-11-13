import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type Character = {
  id: number;
  name: string;
  class: string;
  image: string;
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
  abilities: Ability[];
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
};

type Ability = {
  name: string;
  damage: number;
  type: 'physical' | 'magical' | 'special';
  cooldown: number;
};

type GameScreen = 'menu' | 'deck-builder' | 'battle' | 'inventory' | 'shop' | 'profile';

const CHARACTERS: Character[] = [
  {
    id: 1,
    name: 'Железный Страж',
    class: 'Воин',
    image: 'https://cdn.poehali.dev/projects/1fc2d0aa-fa1e-46d3-814d-192517e13540/files/8b4ac01a-399e-4083-957f-490cc4123d5f.jpg',
    hp: 120,
    maxHp: 120,
    attack: 45,
    defense: 60,
    rarity: 'legendary',
    abilities: [
      { name: 'Удар щитом', damage: 30, type: 'physical', cooldown: 0 },
      { name: 'Защитная стойка', damage: 0, type: 'special', cooldown: 2 },
      { name: 'Сокрушающий удар', damage: 60, type: 'physical', cooldown: 3 }
    ]
  },
  {
    id: 2,
    name: 'Огненный Маг',
    class: 'Маг',
    image: 'https://cdn.poehali.dev/projects/1fc2d0aa-fa1e-46d3-814d-192517e13540/files/d6896e57-3235-48db-8800-1eacf6dd23c1.jpg',
    hp: 80,
    maxHp: 80,
    attack: 70,
    defense: 30,
    rarity: 'epic',
    abilities: [
      { name: 'Огненный шар', damage: 50, type: 'magical', cooldown: 0 },
      { name: 'Метеоритный дождь', damage: 80, type: 'magical', cooldown: 4 },
      { name: 'Огненная стена', damage: 0, type: 'special', cooldown: 3 }
    ]
  },
  {
    id: 3,
    name: 'Лесной Охотник',
    class: 'Лучник',
    image: 'https://cdn.poehali.dev/projects/1fc2d0aa-fa1e-46d3-814d-192517e13540/files/dbfa89d5-fc14-4705-bad2-c39e0a31af79.jpg',
    hp: 90,
    maxHp: 90,
    attack: 55,
    defense: 40,
    rarity: 'rare',
    abilities: [
      { name: 'Точный выстрел', damage: 40, type: 'physical', cooldown: 0 },
      { name: 'Залп стрел', damage: 65, type: 'physical', cooldown: 3 },
      { name: 'Ловушка', damage: 20, type: 'special', cooldown: 2 }
    ]
  },
  {
    id: 4,
    name: 'Теневой Ассасин',
    class: 'Убийца',
    image: 'https://cdn.poehali.dev/projects/1fc2d0aa-fa1e-46d3-814d-192517e13540/files/8b4ac01a-399e-4083-957f-490cc4123d5f.jpg',
    hp: 70,
    maxHp: 70,
    attack: 65,
    defense: 35,
    rarity: 'epic',
    abilities: [
      { name: 'Удар из тени', damage: 55, type: 'physical', cooldown: 0 },
      { name: 'Яд', damage: 45, type: 'special', cooldown: 2 },
      { name: 'Критический удар', damage: 90, type: 'physical', cooldown: 4 }
    ]
  }
];

export default function Index() {
  const [screen, setScreen] = useState<GameScreen>('menu');
  const [playerDeck, setPlayerDeck] = useState<Character[]>([]);
  const [playerName, setPlayerName] = useState('Герой');
  const [favoriteCharacter, setFavoriteCharacter] = useState<number | null>(null);
  const [ownedCharacters, setOwnedCharacters] = useState<number[]>([1, 2]);
  const [gold, setGold] = useState(500);
  const [battleLog, setBattleLog] = useState<string[]>([]);

  const rarityColors = {
    common: 'bg-gray-500',
    rare: 'bg-blue-500',
    epic: 'bg-purple-500',
    legendary: 'bg-gold'
  };

  const rarityGlow = {
    common: 'shadow-gray-500/50',
    rare: 'shadow-blue-500/50',
    epic: 'shadow-purple-500/50',
    legendary: 'shadow-gold/50'
  };

  const MenuScreen = () => (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-background to-background"></div>
      
      <div className="relative z-10 text-center space-y-12 max-w-4xl w-full">
        <div className="space-y-4 animate-fade-in">
          <h1 className="text-7xl font-bold text-transparent bg-clip-text magic-gradient animate-scale-in">
            101 CARD
          </h1>
          <p className="text-xl text-muted-foreground">Эпическая карточная битва</p>
        </div>

        <div className="grid grid-cols-2 gap-6 max-w-2xl mx-auto">
          <Button 
            size="lg" 
            className="h-24 text-xl magic-gradient glow-primary hover:scale-105 transition-all"
            onClick={() => setScreen('deck-builder')}
          >
            <Icon name="Swords" size={28} className="mr-3" />
            Играть
          </Button>
          
          <Button 
            size="lg" 
            className="h-24 text-xl bg-card hover:bg-card/80 border-2 border-primary hover:scale-105 transition-all"
            onClick={() => setScreen('inventory')}
          >
            <Icon name="BookOpen" size={28} className="mr-3" />
            Инвентарь
          </Button>
          
          <Button 
            size="lg" 
            className="h-24 text-xl bg-card hover:bg-card/80 border-2 border-gold hover:scale-105 transition-all"
            onClick={() => setScreen('shop')}
          >
            <Icon name="ShoppingBag" size={28} className="mr-3" />
            Магазин
          </Button>
          
          <Button 
            size="lg" 
            className="h-24 text-xl bg-card hover:bg-card/80 border-2 border-accent hover:scale-105 transition-all"
            onClick={() => setScreen('profile')}
          >
            <Icon name="User" size={28} className="mr-3" />
            Профиль
          </Button>
        </div>
      </div>
    </div>
  );

  const CharacterCard = ({ character, showAbilities = false, onClick, isSelected = false }: any) => (
    <Card 
      className={`card-shine cursor-pointer transition-all duration-300 hover:scale-105 overflow-hidden ${
        isSelected ? 'ring-2 ring-primary glow-primary' : ''
      } ${rarityGlow[character.rarity]}`}
      onClick={onClick}
    >
      <div className="relative">
        <img src={character.image} alt={character.name} className="w-full h-48 object-cover" />
        <Badge className={`absolute top-2 right-2 ${rarityColors[character.rarity]}`}>
          {character.rarity.toUpperCase()}
        </Badge>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <h3 className="font-bold text-lg">{character.name}</h3>
          <p className="text-sm text-muted-foreground">{character.class}</p>
        </div>
      </div>
      
      <div className="p-4 space-y-3">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm flex items-center gap-1">
              <Icon name="Heart" size={16} className="text-red-500" />
              HP
            </span>
            <span className="font-bold">{character.hp}/{character.maxHp}</span>
          </div>
          <Progress value={(character.hp / character.maxHp) * 100} className="h-2" />
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-1">
            <Icon name="Sword" size={16} className="text-primary" />
            <span>Атака: {character.attack}</span>
          </div>
          <div className="flex items-center gap-1">
            <Icon name="Shield" size={16} className="text-blue-500" />
            <span>Защита: {character.defense}</span>
          </div>
        </div>

        {showAbilities && (
          <div className="space-y-2 pt-2 border-t border-border">
            <p className="text-xs font-semibold text-muted-foreground">УМЕНИЯ:</p>
            {character.abilities.map((ability: Ability, idx: number) => (
              <div key={idx} className="text-xs flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <Icon name="Zap" size={12} className="text-accent" />
                  {ability.name}
                </span>
                <span className="text-gold">{ability.damage}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );

  const DeckBuilderScreen = () => {
    const availableCharacters = CHARACTERS.filter(c => ownedCharacters.includes(c.id));
    
    const addToDeck = (character: Character) => {
      if (playerDeck.length < 4 && !playerDeck.find(c => c.id === character.id)) {
        setPlayerDeck([...playerDeck, character]);
      }
    };

    const removeFromDeck = (characterId: number) => {
      setPlayerDeck(playerDeck.filter(c => c.id !== characterId));
    };

    const startBattle = () => {
      if (playerDeck.length === 4) {
        setScreen('battle');
        setBattleLog(['Битва началась!']);
      }
    };

    return (
      <div className="min-h-screen p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={() => setScreen('menu')}>
              <Icon name="ArrowLeft" size={20} className="mr-2" />
              Назад
            </Button>
            <h2 className="text-4xl font-bold">Сбор Колоды</h2>
            <div className="w-24"></div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-semibold">Выбранная колода ({playerDeck.length}/4)</h3>
              <Button 
                size="lg"
                disabled={playerDeck.length !== 4}
                onClick={startBattle}
                className="magic-gradient glow-primary"
              >
                <Icon name="Swords" size={20} className="mr-2" />
                Начать битву
              </Button>
            </div>
            
            <div className="grid grid-cols-4 gap-4">
              {[0, 1, 2, 3].map(idx => (
                <div key={idx}>
                  {playerDeck[idx] ? (
                    <CharacterCard 
                      character={playerDeck[idx]} 
                      onClick={() => removeFromDeck(playerDeck[idx].id)}
                    />
                  ) : (
                    <Card className="h-96 flex items-center justify-center border-dashed border-2">
                      <Icon name="Plus" size={48} className="text-muted-foreground" />
                    </Card>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-2xl font-semibold">Доступные персонажи</h3>
            <div className="grid grid-cols-4 gap-4">
              {availableCharacters.map(character => (
                <CharacterCard 
                  key={character.id}
                  character={character}
                  showAbilities
                  onClick={() => addToDeck(character)}
                  isSelected={playerDeck.some(c => c.id === character.id)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const BattleScreen = () => {
    const [enemyDeck, setEnemyDeck] = useState<Character[]>(
      CHARACTERS.slice(0, 4).map(c => ({ ...c, hp: c.maxHp }))
    );
    const [currentPlayerChar, setCurrentPlayerChar] = useState(0);
    const [currentEnemyChar, setCurrentEnemyChar] = useState(0);

    const attack = (ability: Ability) => {
      const newEnemyDeck = [...enemyDeck];
      const enemy = newEnemyDeck[currentEnemyChar];
      
      enemy.hp = Math.max(0, enemy.hp - ability.damage);
      setEnemyDeck(newEnemyDeck);
      
      const newLog = [
        `${playerDeck[currentPlayerChar].name} использует ${ability.name}! Урон: ${ability.damage}`,
        ...battleLog
      ].slice(0, 10);
      setBattleLog(newLog);

      if (enemy.hp === 0) {
        setBattleLog([`${enemy.name} повержен!`, ...newLog]);
        if (currentEnemyChar < 3) {
          setTimeout(() => setCurrentEnemyChar(currentEnemyChar + 1), 1000);
        }
      }
    };

    return (
      <div className="min-h-screen p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={() => setScreen('menu')}>
              <Icon name="ArrowLeft" size={20} className="mr-2" />
              Сдаться
            </Button>
            <h2 className="text-4xl font-bold text-center">Битва</h2>
            <div className="flex items-center gap-2">
              <Icon name="Coins" size={20} className="text-gold" />
              <span className="text-gold font-bold">{gold}</span>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div className="col-span-3 space-y-6">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-destructive">Противники</h3>
                <div className="grid grid-cols-4 gap-4">
                  {enemyDeck.map((enemy, idx) => (
                    <CharacterCard 
                      key={enemy.id}
                      character={enemy}
                      isSelected={idx === currentEnemyChar}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-primary">Ваша команда</h3>
                <div className="grid grid-cols-4 gap-4">
                  {playerDeck.map((char, idx) => (
                    <CharacterCard 
                      key={char.id}
                      character={char}
                      isSelected={idx === currentPlayerChar}
                    />
                  ))}
                </div>
              </div>

              <Card className="p-6 bg-card/50">
                <h3 className="text-lg font-semibold mb-4">Умения персонажа</h3>
                <div className="grid grid-cols-3 gap-4">
                  {playerDeck[currentPlayerChar]?.abilities.map((ability, idx) => (
                    <Button
                      key={idx}
                      size="lg"
                      onClick={() => attack(ability)}
                      className="flex-col h-auto py-4 space-y-2"
                      variant={ability.type === 'special' ? 'secondary' : 'default'}
                    >
                      <Icon name="Zap" size={24} />
                      <span className="font-bold">{ability.name}</span>
                      <span className="text-gold text-sm">{ability.damage} урона</span>
                    </Button>
                  ))}
                </div>
              </Card>
            </div>

            <Card className="p-4 h-fit">
              <h3 className="text-lg font-semibold mb-4">Лог битвы</h3>
              <div className="space-y-2 text-sm max-h-96 overflow-y-auto">
                {battleLog.map((log, idx) => (
                  <p key={idx} className="text-muted-foreground">{log}</p>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  };

  const InventoryScreen = () => (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => setScreen('menu')}>
            <Icon name="ArrowLeft" size={20} className="mr-2" />
            Назад
          </Button>
          <h2 className="text-4xl font-bold">Инвентарь</h2>
          <div className="w-24"></div>
        </div>

        <div className="space-y-4">
          <p className="text-xl text-muted-foreground">Всего персонажей: {ownedCharacters.length}</p>
          <div className="grid grid-cols-4 gap-6">
            {CHARACTERS.filter(c => ownedCharacters.includes(c.id)).map(character => (
              <CharacterCard key={character.id} character={character} showAbilities />
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const ShopScreen = () => (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => setScreen('menu')}>
            <Icon name="ArrowLeft" size={20} className="mr-2" />
            Назад
          </Button>
          <h2 className="text-4xl font-bold">Магазин</h2>
          <div className="flex items-center gap-2">
            <Icon name="Coins" size={24} className="text-gold" />
            <span className="text-2xl font-bold text-gold">{gold}</span>
          </div>
        </div>

        <Tabs defaultValue="packs" className="space-y-8">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
            <TabsTrigger value="packs">Наборы карт</TabsTrigger>
            <TabsTrigger value="offers">Акции</TabsTrigger>
          </TabsList>

          <TabsContent value="packs" className="space-y-6">
            <div className="grid grid-cols-3 gap-6">
              {[
                { name: 'Базовый набор', price: 100, rarity: 'common', cards: 3 },
                { name: 'Редкий набор', price: 250, rarity: 'rare', cards: 5 },
                { name: 'Легендарный набор', price: 500, rarity: 'legendary', cards: 10 }
              ].map((pack, idx) => (
                <Card key={idx} className="p-6 space-y-4 hover:scale-105 transition-all card-shine">
                  <div className="text-center space-y-2">
                    <Icon name="Package" size={64} className="mx-auto text-primary" />
                    <h3 className="text-xl font-bold">{pack.name}</h3>
                    <Badge className={rarityColors[pack.rarity as keyof typeof rarityColors]}>
                      {pack.rarity.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-center text-muted-foreground">{pack.cards} случайных карт</p>
                  <Button className="w-full magic-gradient" size="lg">
                    <Icon name="Coins" size={20} className="mr-2" />
                    {pack.price} золота
                  </Button>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="offers" className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <Card className="p-8 space-y-4 border-2 border-gold glow-gold">
                <Badge className="bg-gold text-black">СПЕЦИАЛЬНОЕ ПРЕДЛОЖЕНИЕ</Badge>
                <h3 className="text-2xl font-bold">Стартовый пакет героя</h3>
                <p className="text-muted-foreground">3 легендарных персонажа + 1000 золота</p>
                <div className="flex items-center gap-4">
                  <span className="text-4xl font-bold text-gold">999₽</span>
                  <span className="text-2xl text-muted-foreground line-through">1999₽</span>
                </div>
                <Button size="lg" className="w-full bg-gold text-black hover:bg-gold/90">
                  Купить сейчас
                </Button>
              </Card>

              <Card className="p-8 space-y-4 border-2 border-primary glow-primary">
                <Badge className="magic-gradient">ОГРАНИЧЕННОЕ ВРЕМЯ</Badge>
                <h3 className="text-2xl font-bold">Премиум подписка</h3>
                <p className="text-muted-foreground">Ежедневные бонусы + эксклюзивные карты</p>
                <div className="flex items-center gap-4">
                  <span className="text-4xl font-bold text-primary">499₽/мес</span>
                </div>
                <Button size="lg" className="w-full magic-gradient">
                  Подписаться
                </Button>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );

  const ProfileScreen = () => (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => setScreen('menu')}>
            <Icon name="ArrowLeft" size={20} className="mr-2" />
            Назад
          </Button>
          <h2 className="text-4xl font-bold">Профиль</h2>
          <div className="w-24"></div>
        </div>

        <div className="grid grid-cols-3 gap-8">
          <Card className="col-span-2 p-8 space-y-6">
            <div className="space-y-4">
              <label className="text-sm font-semibold">Игровое имя</label>
              <Input 
                value={playerName} 
                onChange={(e) => setPlayerName(e.target.value)}
                className="text-lg"
                placeholder="Введите имя"
              />
            </div>

            <div className="space-y-4">
              <label className="text-sm font-semibold">Любимый персонаж</label>
              <div className="grid grid-cols-2 gap-4">
                {CHARACTERS.filter(c => ownedCharacters.includes(c.id)).map(character => (
                  <Card 
                    key={character.id}
                    className={`p-4 cursor-pointer transition-all ${
                      favoriteCharacter === character.id ? 'ring-2 ring-primary glow-primary' : ''
                    }`}
                    onClick={() => setFavoriteCharacter(character.id)}
                  >
                    <img src={character.image} alt={character.name} className="w-full h-32 object-cover rounded mb-2" />
                    <p className="font-bold text-center">{character.name}</p>
                  </Card>
                ))}
              </div>
            </div>
          </Card>

          <Card className="p-6 space-y-6">
            <div className="text-center space-y-4">
              <div className="w-24 h-24 rounded-full magic-gradient mx-auto flex items-center justify-center">
                <Icon name="User" size={48} />
              </div>
              <h3 className="text-2xl font-bold">{playerName}</h3>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-card/50 rounded">
                <span className="flex items-center gap-2">
                  <Icon name="Trophy" size={20} className="text-gold" />
                  Побед
                </span>
                <span className="font-bold text-xl">12</span>
              </div>

              <div className="flex justify-between items-center p-4 bg-card/50 rounded">
                <span className="flex items-center gap-2">
                  <Icon name="Swords" size={20} className="text-primary" />
                  Боёв
                </span>
                <span className="font-bold text-xl">18</span>
              </div>

              <div className="flex justify-between items-center p-4 bg-card/50 rounded">
                <span className="flex items-center gap-2">
                  <Icon name="BookOpen" size={20} className="text-accent" />
                  Персонажей
                </span>
                <span className="font-bold text-xl">{ownedCharacters.length}</span>
              </div>

              <div className="flex justify-between items-center p-4 bg-card/50 rounded">
                <span className="flex items-center gap-2">
                  <Icon name="Coins" size={20} className="text-gold" />
                  Золото
                </span>
                <span className="font-bold text-xl text-gold">{gold}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {screen === 'menu' && <MenuScreen />}
      {screen === 'deck-builder' && <DeckBuilderScreen />}
      {screen === 'battle' && <BattleScreen />}
      {screen === 'inventory' && <InventoryScreen />}
      {screen === 'shop' && <ShopScreen />}
      {screen === 'profile' && <ProfileScreen />}
    </>
  );
}