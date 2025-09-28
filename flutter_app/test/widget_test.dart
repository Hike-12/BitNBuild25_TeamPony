// Basic Flutter widget test for NourishNet app
//
// This test verifies that the NourishNet app loads correctly and shows
// the login screen when the user is not authenticated.

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:provider/provider.dart';

import 'package:nourish_net/main.dart';
import 'package:nourish_net/shared/providers/auth_provider.dart';
import 'package:nourish_net/shared/providers/theme_provider.dart';

void main() {
  testWidgets('NourishNet app smoke test', (WidgetTester tester) async {
    // Build our app and trigger a frame.
    await tester.pumpWidget(
      MultiProvider(
        providers: [
          ChangeNotifierProvider(create: (_) => ThemeProvider()),
          ChangeNotifierProvider(create: (_) => AuthProvider()),
        ],
        child: const NourishNetApp(),
      ),
    );

    // Wait for the app to initialize
    await tester.pumpAndSettle();

    // Verify that the login screen is shown (since user is not authenticated)
    expect(find.text('Login'), findsWidgets);
    expect(find.text('Email'), findsOneWidget);
    expect(find.text('Password'), findsOneWidget);

    // Verify that there's a login button
    expect(find.widgetWithText(ElevatedButton, 'Login'), findsOneWidget);
  });

  testWidgets('Login form validation test', (WidgetTester tester) async {
    // Build the app
    await tester.pumpWidget(
      MultiProvider(
        providers: [
          ChangeNotifierProvider(create: (_) => ThemeProvider()),
          ChangeNotifierProvider(create: (_) => AuthProvider()),
        ],
        child: const NourishNetApp(),
      ),
    );

    await tester.pumpAndSettle();

    // Try to login without entering credentials
    await tester.tap(find.widgetWithText(ElevatedButton, 'Login'));
    await tester.pump();

    // Should show validation errors
    expect(find.text('Email is required'), findsOneWidget);
    expect(find.text('Password is required'), findsOneWidget);
  });
}
