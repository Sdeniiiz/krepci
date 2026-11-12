import 'package:flutter/material.dart';

void main() {
  runApp(const KrepciApp());
}

class KrepciApp extends StatelessWidget {
  const KrepciApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'KREPCİ Ev Yemekleri',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF0E3D29),
          primary: const Color(0xFF0E3D29),
          secondary: const Color(0xFFE2991E),
        ),
        scaffoldBackgroundColor: const Color(0xFFFAF7F2),
        fontFamily: 'Roboto',
        useMaterial3: true,
      ),
      home: const MainNavigationScreen(),
    );
  }
}

class MainNavigationScreen extends StatefulWidget {
  const MainNavigationScreen({super.key});

  @override
  State<MainNavigationScreen> createState() => _MainNavigationScreenState();
}

class _MainNavigationScreenState extends State<MainNavigationScreen> {
  int _currentIndex = 0;

  final List<Widget> _screens = const [
    MenuHomeScreen(),
    SubscriptionScheduleScreen(),
    DeliveryTrackerScreen(),
    ProfileScreen(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: _screens[_currentIndex],
      bottomNavigationBar: NavigationBar(
        selectedIndex: _currentIndex,
        onDestinationSelected: (idx) => setState(() => _currentIndex = idx),
        destinations: const [
          NavigationDestination(
            icon: Icon(Icons.restaurant_menu),
            label: 'Menü',
          ),
          NavigationDestination(
            icon: Icon(Icons.calendar_month),
            label: 'Programım',
          ),
          NavigationDestination(
            icon: Icon(Icons.delivery_dining),
            label: 'Kurye',
          ),
          NavigationDestination(
            icon: Icon(Icons.person),
            label: 'Hesabım',
          ),
        ],
      ),
    );
  }
}

// Ana Menü Ekranı
class MenuHomeScreen extends StatelessWidget {
  const MenuHomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('KREPCİ Ev Yemekleri', style: TextStyle(fontWeight: FontWeight.bold)),
        backgroundColor: const Color(0xFF0E3D29),
        foregroundColor: const Color(0xFFE2991E),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          // Banner
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [Color(0xFF0E3D29), Color(0xFF185A3E)],
              ),
              borderRadius: BorderRadius.circular(16),
            ),
            child: const Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Anne Eli Değmiş Sıcak Ev Yemekleri',
                  style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold),
                ),
                SizedBox(height: 6),
                Text(
                  'Aylık avantajlı abonelik veya günlük kapıda ödemeyle her gün kapınızda!',
                  style: TextStyle(color: Colors.white70, fontSize: 13),
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),
          const Text('Haftalık Porsiyon Fiyatları', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
          const SizedBox(height: 10),
          _buildPriceTile('1 Çeşit Menü', '180 ₺', 'Hafif & Pratik'),
          _buildPriceTile('2 Çeşit Menü', '260 ₺', 'Dengeli'),
          _buildPriceTile('3 Çeşit Menü', '290 ₺', 'En Çok Satan'),
          _buildPriceTile('4 Çeşit Menü', '320 ₺', 'Doyurucu'),
          _buildPriceTile('Aşçı Tabağı', '450 ₺', 'Şefin İmzası'),
        ],
      ),
    );
  }

  static Widget _buildPriceTile(String title, String price, String badge) {
    return Card(
      margin: const EdgeInsets.only(bottom: 8),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: ListTile(
        title: Text(title, style: const TextStyle(fontWeight: FontWeight.bold)),
        subtitle: Text(badge),
        trailing: Text(price, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w900, color: Color(0xFF0E3D29))),
      ),
    );
  }
}

// Kişisel Program Ekranı
class SubscriptionScheduleScreen extends StatelessWidget {
  const SubscriptionScheduleScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Haftalık Yemek Programım')),
      body: const Center(
        child: Text('Kişisel Günlük Yemek Programınız'),
      ),
    );
  }
}

// Kurye Takip Ekranı
class DeliveryTrackerScreen extends StatelessWidget {
  const DeliveryTrackerScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Kurye & Teslimat Takibi')),
      body: const Center(
        child: Text('Bugünkü Yemeğiniz Mutfakta Hazırlanıyor'),
      ),
    );
  }
}

// Profil Ekranı
class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Abonelik Hesabım')),
      body: const Center(
        child: Text('Abonelik Bilgileri ve Ödeme Tercihleri'),
      ),
    );
  }
}
