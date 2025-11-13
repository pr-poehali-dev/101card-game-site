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
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  basicAttack: BasicAttack;
  skill1: Skill;
  skill2: Skill;
  ultimate: Ultimate;
  superCharge: number;
};

type BasicAttack = {
  name: string;
  damage: number;
  heal?: number;
  superCharge: number;
  description: string;
};

type Skill = {
  name: string;
  damage: number;
  hits?: number;
  heal?: number;
  superCharge: number;
  maxUses: number;
  usesLeft: number;
  description: string;
  target: 'single' | 'all';
};

type Ultimate = {
  name: string;
  damage: number;
  heal?: number;
  description: string;
  target: 'single' | 'all' | 'team';
};

type GameScreen = 'menu' | 'deck-builder' | 'battle' | 'inventory' | 'shop' | 'profile';

const CHARACTERS: Character[] = [
  {
    id: 1,
    name: 'БШ',
    class: 'Дебаффер',
    image: 'https://cdn.poehali.dev/projects/1fc2d0aa-fa1e-46d3-814d-192517e13540/files/3b7a2908-fcd3-4470-9860-da109f5bb92e.jpg',
    hp: 95,
    maxHp: 95,
    rarity: 'legendary',
    superCharge: 0,
    basicAttack: {
      name: 'Лозы природы',
      damage: 25,
      heal: 10,
      superCharge: 15,
      description: 'Призывает лозы, которые связывают врага (25 урона) и исцеляют БШ (10 HP)'
    },
    skill1: {
      name: 'Дух крокодила',
      damage: 45,
      superCharge: 20,
      maxUses: 2,
      usesLeft: 2,
      description: 'Призывает духа крокодила, наносящего 45 урона',
      target: 'single'
    },
    skill2: {
      name: 'Дух лошади',
      damage: 5,
      hits: 6,
      superCharge: 0,
      maxUses: 1,
      usesLeft: 1,
      description: 'Лошадь топчется, нанося 5 урона 6 раз (всего 30)',
      target: 'single'
    },
    ultimate: {
      name: 'Гнев природы',
      damage: 25,
      heal: 10,
      description: 'Лозы исцеляют всю команду на 10 HP и наносят 25 урона всем врагам',
      target: 'all'
    }
  }
];

export default function Index() {
  const [screen, setScreen] = useState<GameScreen>('menu');
  const [playerDeck, setPlayerDeck] = useState<Character[]>([]);
  const [playerName, setPlayerName] = useState('Герой');
  const [favoriteCharacter, setFavoriteCharacter] = useState<number | null>(null);
  const [ownedCharacters, setOwnedCharacters] = useState<number[]>([1]);
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

  const CharacterCard = ({ character, showAbilities = false, onClick, isSelected = false, inBattle = false }: any) => (
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

        {inBattle && (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs flex items-center gap-1">
                <Icon name="Sparkles" size={14} className="text-accent" />
                Ультимейт
              </span>
              <span className="text-xs font-bold">{Math.round(character.superCharge)}%</span>
            </div>
            <Progress value={character.superCharge} className="h-1.5 bg-muted" />
          </div>
        )}

        {showAbilities && (
          <div className="space-y-3 pt-2 border-t border-border">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                <Icon name="Swords" size={12} />
                БАЗОВАЯ АТАКА:
              </p>
              <p className="text-xs text-muted-foreground">{character.basicAttack.description}</p>
            </div>
            
            <div className="space-y-1">
              <p className="text-xs font-semibold text-blue-400 flex items-center gap-1">
                <Icon name="Zap" size={12} />
                {character.skill1.name} ({character.skill1.usesLeft}/{character.skill1.maxUses})
              </p>
              <p className="text-xs text-muted-foreground">{character.skill1.description}</p>
            </div>

            <div className="space-y-1">
              <p className="text-xs font-semibold text-purple-400 flex items-center gap-1">
                <Icon name="Zap" size={12} />
                {character.skill2.name} ({character.skill2.usesLeft}/{character.skill2.maxUses})
              </p>
              <p className="text-xs text-muted-foreground">{character.skill2.description}</p>
            </div>

            <div className="space-y-1">
              <p className="text-xs font-semibold text-gold flex items-center gap-1">
                <Icon name="Sparkles" size={12} />
                УЛЬТИМЕЙТ: {character.ultimate.name}
              </p>
              <p className="text-xs text-muted-foreground">{character.ultimate.description}</p>
            </div>
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
      CHARACTERS.slice(0, 1).map(c => ({ 
        ...c, 
        hp: c.maxHp,
        superCharge: 0,
        skill1: { ...c.skill1, usesLeft: c.skill1.maxUses },
        skill2: { ...c.skill2, usesLeft: c.skill2.maxUses }
      }))
    );
    const [battlePlayerDeck, setBattlePlayerDeck] = useState<Character[]>(
      playerDeck.map(c => ({ 
        ...c, 
        superCharge: 0,
        skill1: { ...c.skill1, usesLeft: c.skill1.maxUses },
        skill2: { ...c.skill2, usesLeft: c.skill2.maxUses }
      }))
    );
    const [currentPlayerChar, setCurrentPlayerChar] = useState(0);
    const [currentEnemyChar, setCurrentEnemyChar] = useState(0);

    const addLog = (message: string) => {
      setBattleLog(prev => [message, ...prev].slice(0, 15));
    };

    const useBasicAttack = () => {
      const attacker = battlePlayerDeck[currentPlayerChar];
      const target = enemyDeck[currentEnemyChar];
      
      const newEnemyDeck = [...enemyDeck];
      newEnemyDeck[currentEnemyChar].hp = Math.max(0, target.hp - attacker.basicAttack.damage);
      setEnemyDeck(newEnemyDeck);

      const newPlayerDeck = [...battlePlayerDeck];
      if (attacker.basicAttack.heal) {
        newPlayerDeck[currentPlayerChar].hp = Math.min(
          attacker.maxHp,
          attacker.hp + attacker.basicAttack.heal
        );
      }
      newPlayerDeck[currentPlayerChar].superCharge = Math.min(
        100,
        attacker.superCharge + attacker.basicAttack.superCharge
      );
      setBattlePlayerDeck(newPlayerDeck);

      addLog(`${attacker.name}: ${attacker.basicAttack.name} - ${attacker.basicAttack.damage} урона${attacker.basicAttack.heal ? `, +${attacker.basicAttack.heal} HP` : ''}`);

      if (newEnemyDeck[currentEnemyChar].hp === 0) {
        addLog(`${target.name} повержен!`);
      }
    };

    const useSkill1 = () => {
      const attacker = battlePlayerDeck[currentPlayerChar];
      if (attacker.skill1.usesLeft <= 0) return;

      const target = enemyDeck[currentEnemyChar];
      const newEnemyDeck = [...enemyDeck];
      newEnemyDeck[currentEnemyChar].hp = Math.max(0, target.hp - attacker.skill1.damage);
      setEnemyDeck(newEnemyDeck);

      const newPlayerDeck = [...battlePlayerDeck];
      newPlayerDeck[currentPlayerChar].skill1.usesLeft -= 1;
      newPlayerDeck[currentPlayerChar].superCharge = Math.min(
        100,
        attacker.superCharge + attacker.skill1.superCharge
      );
      setBattlePlayerDeck(newPlayerDeck);

      addLog(`${attacker.name}: ${attacker.skill1.name} - ${attacker.skill1.damage} урона (${attacker.skill1.usesLeft - 1}/${attacker.skill1.maxUses} осталось)`);

      if (newEnemyDeck[currentEnemyChar].hp === 0) {
        addLog(`${target.name} повержен!`);
      }
    };

    const useSkill2 = () => {
      const attacker = battlePlayerDeck[currentPlayerChar];
      if (attacker.skill2.usesLeft <= 0) return;

      const target = enemyDeck[currentEnemyChar];
      const totalDamage = attacker.skill2.damage * (attacker.skill2.hits || 1);
      
      const newEnemyDeck = [...enemyDeck];
      newEnemyDeck[currentEnemyChar].hp = Math.max(0, target.hp - totalDamage);
      setEnemyDeck(newEnemyDeck);

      const newPlayerDeck = [...battlePlayerDeck];
      newPlayerDeck[currentPlayerChar].skill2.usesLeft -= 1;
      newPlayerDeck[currentPlayerChar].superCharge = Math.min(
        100,
        attacker.superCharge + attacker.skill2.superCharge
      );
      setBattlePlayerDeck(newPlayerDeck);

      addLog(`${attacker.name}: ${attacker.skill2.name} - ${attacker.skill2.hits}x${attacker.skill2.damage} = ${totalDamage} урона (${attacker.skill2.usesLeft - 1}/${attacker.skill2.maxUses})`);

      if (newEnemyDeck[currentEnemyChar].hp === 0) {
        addLog(`${target.name} повержен!`);
      }
    };

    const useUltimate = () => {
      const attacker = battlePlayerDeck[currentPlayerChar];
      if (attacker.superCharge < 100) return;

      if (attacker.ultimate.target === 'all') {
        const newEnemyDeck = enemyDeck.map(enemy => ({
          ...enemy,
          hp: Math.max(0, enemy.hp - attacker.ultimate.damage)
        }));
        setEnemyDeck(newEnemyDeck);

        if (attacker.ultimate.heal) {
          const newPlayerDeck = battlePlayerDeck.map(char => ({
            ...char,
            hp: Math.min(char.maxHp, char.hp + (attacker.ultimate.heal || 0))
          }));
          newPlayerDeck[currentPlayerChar].superCharge = 0;
          setBattlePlayerDeck(newPlayerDeck);
        }

        addLog(`${attacker.name}: ${attacker.ultimate.name} - ${attacker.ultimate.damage} урона всем врагам${attacker.ultimate.heal ? `, команда +${attacker.ultimate.heal} HP` : ''}!`);
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
                  {battlePlayerDeck.map((char, idx) => (
                    <CharacterCard 
                      key={char.id}
                      character={char}
                      isSelected={idx === currentPlayerChar}
                      inBattle
                    />
                  ))}
                </div>
              </div>

              <Card className="p-6 bg-card/50">
                <h3 className="text-lg font-semibold mb-4">Умения {battlePlayerDeck[currentPlayerChar]?.name}</h3>
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    size="lg"
                    onClick={useBasicAttack}
                    className="flex-col h-auto py-4 space-y-2 bg-gradient-to-br from-green-600 to-green-700 hover:from-green-500 hover:to-green-600"
                  >
                    <Icon name="Leaf" size={24} />
                    <span className="font-bold">{battlePlayerDeck[currentPlayerChar]?.basicAttack.name}</span>
                    <span className="text-xs text-center">{battlePlayerDeck[currentPlayerChar]?.basicAttack.description}</span>
                    <span className="text-gold text-sm">+{battlePlayerDeck[currentPlayerChar]?.basicAttack.superCharge}% заряд</span>
                  </Button>

                  <Button
                    size="lg"
                    onClick={useSkill1}
                    disabled={battlePlayerDeck[currentPlayerChar]?.skill1.usesLeft === 0}
                    className="flex-col h-auto py-4 space-y-2 bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 disabled:opacity-50"
                  >
                    <Icon name="Turtle" size={24} />
                    <span className="font-bold">{battlePlayerDeck[currentPlayerChar]?.skill1.name}</span>
                    <span className="text-xs">({battlePlayerDeck[currentPlayerChar]?.skill1.usesLeft}/{battlePlayerDeck[currentPlayerChar]?.skill1.maxUses})</span>
                    <span className="text-gold text-sm">{battlePlayerDeck[currentPlayerChar]?.skill1.damage} урона</span>
                  </Button>

                  <Button
                    size="lg"
                    onClick={useSkill2}
                    disabled={battlePlayerDeck[currentPlayerChar]?.skill2.usesLeft === 0}
                    className="flex-col h-auto py-4 space-y-2 bg-gradient-to-br from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 disabled:opacity-50"
                  >
                    <Icon name="Rabbit" size={24} />
                    <span className="font-bold">{battlePlayerDeck[currentPlayerChar]?.skill2.name}</span>
                    <span className="text-xs">({battlePlayerDeck[currentPlayerChar]?.skill2.usesLeft}/{battlePlayerDeck[currentPlayerChar]?.skill2.maxUses})</span>
                    <span className="text-gold text-sm">{battlePlayerDeck[currentPlayerChar]?.skill2.hits}x{battlePlayerDeck[currentPlayerChar]?.skill2.damage} урона</span>
                  </Button>

                  <Button
                    size="lg"
                    onClick={useUltimate}
                    disabled={battlePlayerDeck[currentPlayerChar]?.superCharge < 100}
                    className="flex-col h-auto py-4 space-y-2 bg-gradient-to-br from-gold to-orange-600 hover:from-yellow-500 hover:to-orange-500 disabled:opacity-50"
                  >
                    <Icon name="Sparkles" size={24} />
                    <span className="font-bold">{battlePlayerDeck[currentPlayerChar]?.ultimate.name}</span>
                    <span className="text-xs text-center">{Math.round(battlePlayerDeck[currentPlayerChar]?.superCharge || 0)}%</span>
                    <span className="text-white text-sm">УЛЬТИМЕЙТ</span>
                  </Button>
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