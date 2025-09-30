import 'dart:async';

import 'package:flutter/foundation.dart';
import 'package:flutter/widgets.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:intl/intl.dart' as intl;

import 'app_localizations_en.dart';
import 'app_localizations_hi.dart';

// ignore_for_file: type=lint

/// Callers can lookup localized strings with an instance of AppLocalizations
/// returned by `AppLocalizations.of(context)`.
///
/// Applications need to include `AppLocalizations.delegate()` in their app's
/// `localizationDelegates` list, and the locales they support in the app's
/// `supportedLocales` list. For example:
///
/// ```dart
/// import 'l10n/app_localizations.dart';
///
/// return MaterialApp(
///   localizationsDelegates: AppLocalizations.localizationsDelegates,
///   supportedLocales: AppLocalizations.supportedLocales,
///   home: MyApplicationHome(),
/// );
/// ```
///
/// ## Update pubspec.yaml
///
/// Please make sure to update your pubspec.yaml to include the following
/// packages:
///
/// ```yaml
/// dependencies:
///   # Internationalization support.
///   flutter_localizations:
///     sdk: flutter
///   intl: any # Use the pinned version from flutter_localizations
///
///   # Rest of dependencies
/// ```
///
/// ## iOS Applications
///
/// iOS applications define key application metadata, including supported
/// locales, in an Info.plist file that is built into the application bundle.
/// To configure the locales supported by your app, you’ll need to edit this
/// file.
///
/// First, open your project’s ios/Runner.xcworkspace Xcode workspace file.
/// Then, in the Project Navigator, open the Info.plist file under the Runner
/// project’s Runner folder.
///
/// Next, select the Information Property List item, select Add Item from the
/// Editor menu, then select Localizations from the pop-up menu.
///
/// Select and expand the newly-created Localizations item then, for each
/// locale your application supports, add a new item and select the locale
/// you wish to add from the pop-up menu in the Value field. This list should
/// be consistent with the languages listed in the AppLocalizations.supportedLocales
/// property.
abstract class AppLocalizations {
  AppLocalizations(String locale)
    : localeName = intl.Intl.canonicalizedLocale(locale.toString());

  final String localeName;

  static AppLocalizations? of(BuildContext context) {
    return Localizations.of<AppLocalizations>(context, AppLocalizations);
  }

  static const LocalizationsDelegate<AppLocalizations> delegate =
      _AppLocalizationsDelegate();

  /// A list of this localizations delegate along with the default localizations
  /// delegates.
  ///
  /// Returns a list of localizations delegates containing this delegate along with
  /// GlobalMaterialLocalizations.delegate, GlobalCupertinoLocalizations.delegate,
  /// and GlobalWidgetsLocalizations.delegate.
  ///
  /// Additional delegates can be added by appending to this list in
  /// MaterialApp. This list does not have to be used at all if a custom list
  /// of delegates is preferred or required.
  static const List<LocalizationsDelegate<dynamic>> localizationsDelegates =
      <LocalizationsDelegate<dynamic>>[
        delegate,
        GlobalMaterialLocalizations.delegate,
        GlobalCupertinoLocalizations.delegate,
        GlobalWidgetsLocalizations.delegate,
      ];

  /// A list of this localizations delegate's supported locales.
  static const List<Locale> supportedLocales = <Locale>[
    Locale('en'),
    Locale('hi'),
  ];

  /// The title of the application
  ///
  /// In en, this message translates to:
  /// **'NourishNet - Tiffin Service'**
  String get appTitle;

  /// Welcome message for users
  ///
  /// In en, this message translates to:
  /// **'Welcome back'**
  String get welcome;

  /// Welcome message displayed to users
  ///
  /// In en, this message translates to:
  /// **'Welcome to NourishNet'**
  String get welcomeMessage;

  /// Text for language selection option
  ///
  /// In en, this message translates to:
  /// **'Select Language'**
  String get selectLanguage;

  /// English language name
  ///
  /// In en, this message translates to:
  /// **'English'**
  String get english;

  /// Hindi language name in its native script
  ///
  /// In en, this message translates to:
  /// **'हिंदी'**
  String get hindi;

  /// Dashboard navigation label
  ///
  /// In en, this message translates to:
  /// **'Dashboard'**
  String get dashboard;

  /// Menu navigation label
  ///
  /// In en, this message translates to:
  /// **'Menu'**
  String get menu;

  /// Premium/Subscription navigation label
  ///
  /// In en, this message translates to:
  /// **'Premium'**
  String get premium;

  /// Profile navigation label
  ///
  /// In en, this message translates to:
  /// **'Profile'**
  String get profile;

  /// Login button text
  ///
  /// In en, this message translates to:
  /// **'Login'**
  String get login;

  /// Register button text
  ///
  /// In en, this message translates to:
  /// **'Register'**
  String get register;

  /// Email field label
  ///
  /// In en, this message translates to:
  /// **'Email'**
  String get email;

  /// Password field label
  ///
  /// In en, this message translates to:
  /// **'Password'**
  String get password;

  /// Username field label
  ///
  /// In en, this message translates to:
  /// **'Username'**
  String get username;

  /// Success message after login
  ///
  /// In en, this message translates to:
  /// **'Login successful!'**
  String get loginSuccessful;

  /// Error message when login fails
  ///
  /// In en, this message translates to:
  /// **'Login failed. Please check your credentials.'**
  String get loginFailed;

  /// Title for subscriptions page
  ///
  /// In en, this message translates to:
  /// **'My Subscriptions'**
  String get mySubscriptions;

  /// Label for meal progress indicator
  ///
  /// In en, this message translates to:
  /// **'Meals Progress'**
  String get mealsProgress;

  /// Label for price per meal
  ///
  /// In en, this message translates to:
  /// **'Price per Meal'**
  String get pricePerMeal;

  /// Default text when vendor name is not available
  ///
  /// In en, this message translates to:
  /// **'Unknown Vendor'**
  String get unknownVendor;

  /// Hero text for sophisticated dining
  ///
  /// In en, this message translates to:
  /// **'Curated Culinary Excellence'**
  String get curatedCulinaryExcellence;

  /// Hero text for dining experience
  ///
  /// In en, this message translates to:
  /// **'Sophisticated Dining Experience'**
  String get sophisticatedDiningExperience;

  /// Hero text for local cuisine
  ///
  /// In en, this message translates to:
  /// **'Premium Local Gastronomy'**
  String get premiumLocalGastronomy;

  /// Subtitle for culinary excellence
  ///
  /// In en, this message translates to:
  /// **'Discover artisanal flavors from the finest local establishments'**
  String get discoverArtisanalFlavors;

  /// Subtitle for sophisticated dining
  ///
  /// In en, this message translates to:
  /// **'Where exceptional taste meets unparalleled service'**
  String get exceptionalTasteService;

  /// Subtitle for premium gastronomy
  ///
  /// In en, this message translates to:
  /// **'Elevating neighborhood dining to extraordinary heights'**
  String get elevatingNeighborhoodDining;

  /// Section title for user stats
  ///
  /// In en, this message translates to:
  /// **'Your Culinary Journey'**
  String get yourCulinaryJourney;

  /// Game feature title
  ///
  /// In en, this message translates to:
  /// **'Elite Rewards'**
  String get eliteRewards;

  /// Game feature title
  ///
  /// In en, this message translates to:
  /// **'Culinary Achievements'**
  String get culinaryAchievements;

  /// Game feature title
  ///
  /// In en, this message translates to:
  /// **'VIP Recognition'**
  String get vipRecognition;

  /// Description for elite rewards
  ///
  /// In en, this message translates to:
  /// **'Exclusive privileges and premium benefits with every curated experience'**
  String get exclusivePrivileges;

  /// Description for culinary achievements
  ///
  /// In en, this message translates to:
  /// **'Unlock prestigious badges as you explore refined dining experiences'**
  String get unlockPrestigiousBadges;

  /// Description for VIP recognition
  ///
  /// In en, this message translates to:
  /// **'Distinguished status and personalized recommendations for connoisseurs'**
  String get distinguishedStatus;

  /// Call to action for new subscriptions
  ///
  /// In en, this message translates to:
  /// **'Start Your Culinary Journey'**
  String get startCulinaryJourney;

  /// Description for premium subscription benefits
  ///
  /// In en, this message translates to:
  /// **'Subscribe to premium dining experiences and unlock exclusive benefits'**
  String get subscribeToPremium;

  /// Section title for recent orders
  ///
  /// In en, this message translates to:
  /// **'Recent Culinary Experiences'**
  String get recentCulinaryExperiences;

  /// Section title for action items
  ///
  /// In en, this message translates to:
  /// **'Discover More'**
  String get discoverMore;

  /// Action item title
  ///
  /// In en, this message translates to:
  /// **'Curated Menus'**
  String get curatedMenus;

  /// Action item subtitle for menus
  ///
  /// In en, this message translates to:
  /// **'Explore handpicked selections'**
  String get exploreHandpicked;

  /// Action item title for subscriptions
  ///
  /// In en, this message translates to:
  /// **'Premium Plans'**
  String get premiumPlans;

  /// Action item subtitle for premium plans
  ///
  /// In en, this message translates to:
  /// **'Unlock exclusive benefits'**
  String get unlockExclusiveBenefits;

  /// Action item title for profile
  ///
  /// In en, this message translates to:
  /// **'Profile & Settings'**
  String get profileSettings;

  /// Action item subtitle for profile
  ///
  /// In en, this message translates to:
  /// **'Personalize your experience'**
  String get personalizeExperience;

  /// Loading indicator text
  ///
  /// In en, this message translates to:
  /// **'Loading...'**
  String get loading;

  /// Retry button text
  ///
  /// In en, this message translates to:
  /// **'Retry'**
  String get retry;

  /// Cancel button text
  ///
  /// In en, this message translates to:
  /// **'Cancel'**
  String get cancel;

  /// Confirm button text
  ///
  /// In en, this message translates to:
  /// **'Confirm'**
  String get confirm;

  /// Save button text
  ///
  /// In en, this message translates to:
  /// **'Save'**
  String get save;

  /// Edit button text
  ///
  /// In en, this message translates to:
  /// **'Edit'**
  String get edit;

  /// Delete button text
  ///
  /// In en, this message translates to:
  /// **'Delete'**
  String get delete;

  /// Settings page title
  ///
  /// In en, this message translates to:
  /// **'Settings'**
  String get settings;

  /// Language setting label
  ///
  /// In en, this message translates to:
  /// **'Language'**
  String get language;

  /// Theme setting label
  ///
  /// In en, this message translates to:
  /// **'Theme'**
  String get theme;

  /// Light theme option
  ///
  /// In en, this message translates to:
  /// **'Light Mode'**
  String get lightMode;

  /// Dark theme option
  ///
  /// In en, this message translates to:
  /// **'Dark Mode'**
  String get darkMode;
}

class _AppLocalizationsDelegate
    extends LocalizationsDelegate<AppLocalizations> {
  const _AppLocalizationsDelegate();

  @override
  Future<AppLocalizations> load(Locale locale) {
    return SynchronousFuture<AppLocalizations>(lookupAppLocalizations(locale));
  }

  @override
  bool isSupported(Locale locale) =>
      <String>['en', 'hi'].contains(locale.languageCode);

  @override
  bool shouldReload(_AppLocalizationsDelegate old) => false;
}

AppLocalizations lookupAppLocalizations(Locale locale) {
  // Lookup logic when only language code is specified.
  switch (locale.languageCode) {
    case 'en':
      return AppLocalizationsEn();
    case 'hi':
      return AppLocalizationsHi();
  }

  throw FlutterError(
    'AppLocalizations.delegate failed to load unsupported locale "$locale". This is likely '
    'an issue with the localizations generation tool. Please file an issue '
    'on GitHub with a reproducible sample app and the gen-l10n configuration '
    'that was used.',
  );
}
