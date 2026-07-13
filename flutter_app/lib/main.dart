import 'package:flutter/material.dart';
import 'ffi_bridge.dart';

void main() {
  runApp(const GSTFlowApp());
}

class GSTFlowApp extends StatelessWidget {
  const GSTFlowApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'GSTFlow Validator',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
        useMaterial3: true,
      ),
      home: const VerificationScreen(),
    );
  }
}

class VerificationScreen extends StatefulWidget {
  const VerificationScreen({super.key});

  @override
  State<VerificationScreen> createState() => _VerificationScreenState();
}

class _VerificationScreenState extends State<VerificationScreen> {
  final _gstinController = TextEditingController();
  String _validationResult = '';
  Color _resultColor = Colors.black;

  void _verifyGSTIN() {
    final gstinStr = _gstinController.text.trim();
    if (gstinStr.isEmpty) {
      setState(() {
        _validationResult = 'Please enter a GSTIN';
        _resultColor = Colors.orange;
      });
      return;
    }

    try {
      final result = ffiBridge.verifyGstin(gstinStr);
      if (result['valid'] == true) {
        setState(() {
          _validationResult = '✅ Valid GSTIN Format';
          _resultColor = Colors.green;
        });
      } else {
        setState(() {
          _validationResult = '❌ Invalid GSTIN: ${result['error']}';
          _resultColor = Colors.red;
        });
      }
    } catch (e) {
      setState(() {
        _validationResult = 'Error verifying GSTIN: $e';
        _resultColor = Colors.red;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
        title: const Text('GSTFlow Engine Validation'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            const Icon(Icons.security, size: 80, color: Colors.teal),
            const SizedBox(height: 24),
            TextField(
              controller: _gstinController,
              decoration: const InputDecoration(
                border: OutlineInputBorder(),
                labelText: 'Enter GSTIN (e.g. 27AAAAA0000A1Z5)',
              ),
              textCapitalization: TextCapitalization.characters,
            ),
            const SizedBox(height: 16),
            ElevatedButton(
              onPressed: _verifyGSTIN,
              style: ElevatedButton.styleFrom(
                padding: const EdgeInsets.symmetric(vertical: 16),
              ),
              child: const Text('Verify via F# Engine', style: TextStyle(fontSize: 16)),
            ),
            const SizedBox(height: 32),
            Text(
              _validationResult,
              textAlign: TextAlign.center,
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: _resultColor,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
